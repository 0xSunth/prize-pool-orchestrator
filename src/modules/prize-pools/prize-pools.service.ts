import { Injectable } from '@nestjs/common';
import { CreatePrizePoolDto } from './dto/create-prize-pool.dto.js';
import { PrizePool } from './entity/prize-pool.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ethers, JsonRpcProvider, toBeHex, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { createRequire } from 'module';
import { safeTx } from '../../utils/ethers.js';
import { IPrizePool } from './interface/prize-pool.interface.js';
import { Scheduler } from '../schedulers/entity/scheduler.entity.js';
import { SchedulersService } from '../schedulers/schedulers.service.js';

const require = createRequire(import.meta.url);

const prizePoolFactoryAbi = require('../../global/abis/prize-pool-factory.json');
const vaultAbi = require('../../global/abis/vault.json');
const prizePoolAbi = require('../../global/abis/prize-pool.json');

@Injectable()
export class PrizePoolsService {
  private provider: JsonRpcProvider;
  private signer: Wallet;

  constructor(
    @InjectRepository(PrizePool)
    private prizePoolRepository: Repository<PrizePool>,
    private configService: ConfigService,
    private schedulersService: SchedulersService,
  ) {
    this.provider = new JsonRpcProvider(this.configService.get<string>('ethereum.sepolia.rpcUrl'));
    this.signer = new Wallet(this.configService.get('wallet').privateKey, this.provider);
  }

  async create(createPrizePoolDto: CreatePrizePoolDto): Promise<{ prizePool: string }> {
    const prizePool = PrizePool.fromDto(createPrizePoolDto);
    const { id, address } = await this.deployPrizePoolContract(createPrizePoolDto);
    prizePool.id = id;
    prizePool.address = address;

    const { duration, startTime } = await this.getCurrentEpochInfo(address);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    const scheduler = new Scheduler({
      prizePool,
      lastExecution: undefined,
      nextExecution: new Date((nowInSeconds + Number(duration)) * 1000),
      status: 'idle',
      retryAt: undefined,
      notes: 'Waiting for the end of the first epoch',
    });

    prizePool.scheduler = scheduler;
    await this.prizePoolRepository.save(prizePool);

    await this.schedulersService.reloadScheduler(scheduler.id);

    return { prizePool: address };
  }

  async deployPrizePoolContract(createPrizePoolDto: CreatePrizePoolDto): Promise<{
    id: number;
    address: string;
  }> {
    const prizePoolFactoryContract = new Contract(
      this.configService.get('ethereum.sepolia.contracts').prizePoolFactory,
      prizePoolFactoryAbi,
      this.signer,
    );
    const vaultContract = new Contract(createPrizePoolDto.vault, vaultAbi, this.provider);

    const decimals = await vaultContract.decimals();
    const prizePoolArgs: IPrizePool = {
      owner: createPrizePoolDto.owner,
      vault: createPrizePoolDto.vault,
      feeRecipient: createPrizePoolDto.vault,
      treasury: createPrizePoolDto.treasury,
      bonusConfig: {
        bonusPerEpoch: ethers.toBigInt(createPrizePoolDto.bonusPerEpoch * 100),
        maxBonus: ethers.toBigInt(10000n),
        decayPerEpoch: ethers.toBigInt(100n),
      },
      epochConfig: {
        epochDuration: ethers.toBigInt(createPrizePoolDto.epochDuration),
        entryDeadline: ethers.toBigInt(createPrizePoolDto.entryDeadline),
        maxParticipants: ethers.toBigInt(createPrizePoolDto.maxParticipants),
      },
      participationRules: {
        minDepositAmount: ethers.parseUnits(
          createPrizePoolDto.minDepositAmount.toString(),
          decimals,
        ),
        maxWithdrawFee: ethers.toBigInt(createPrizePoolDto.maxWithdrawFee * 100),
      },
    };

    const receipt = await safeTx({
      contract: prizePoolFactoryContract,
      functionName: 'createPrizePool',
      provider: this.provider,
      options: {
        gasBuffer: 1.2,
        logPrefix: 'FACTORY_PRIZE_POOL_CREATION',
        args: [prizePoolArgs],
      },
    });

    if (!receipt) {
      throw new Error('Transaction failed: no receipt returned.');
    }

    const prizePoolCreatedEvent = receipt.logs
      .map((log) => {
        try {
          return prizePoolFactoryContract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsedLog) => parsedLog?.name === 'PrizePoolCreated');
    if (!prizePoolCreatedEvent) {
      throw new Error('PrizePoolCreated event not found.');
    }
    const vault = prizePoolCreatedEvent.args[0];
    const prizePool = prizePoolCreatedEvent.args[1];

    return {
      id: 0, // Get id by smart-contract
      address: prizePool,
    };
  }

  async getCurrentEpochInfo(
    prizePoolAddress: string,
  ): Promise<{ duration: number; startTime: number }> {
    const prizePoolContract = new Contract(toBeHex(prizePoolAddress), prizePoolAbi, this.provider);
    const currentEpoch = await prizePoolContract.getCurrentEpoch();
    const epochDuration = await prizePoolContract.getEpochDuration();
    const epochStartTime = await prizePoolContract.getEpochStartTime(currentEpoch);

    return {
      duration: epochDuration,
      startTime: epochStartTime,
    };
  }
}
