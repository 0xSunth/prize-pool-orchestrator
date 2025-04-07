import { Injectable } from '@nestjs/common';
import { CreatePrizePoolDto } from './dto/create-prize-pool.dto.js';
import { PrizePool } from './entity/prize-pool.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ethers, JsonRpcProvider, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';
import prizePoolFactoryAbi from '../../global/abis/prize-pool-factory.json' with { type: 'json' };
import vaultAbi from '../../global/abis/vault.json' with { type: 'json' };
import { safeTx } from '../../utils/ethers.js';
import { IPrizePool } from './interface/prize-pool.interface.js';

@Injectable()
export class PrizePoolsService {
  private provider: JsonRpcProvider;
  private signer: Wallet;

  constructor(
    @InjectRepository(PrizePool)
    private prizePoolRepository: Repository<PrizePool>,
    private configService: ConfigService,
  ) {
    this.provider = new JsonRpcProvider(this.configService.get<string>('ethereum.sepolia.rpcUrl'));
    this.signer = new Wallet(this.configService.get('wallet').privateKey, this.provider);
  }

  async create(createPrizePoolDto: CreatePrizePoolDto): Promise<PrizePool> {
    const prizePool = PrizePool.fromDto(createPrizePoolDto);
    const { id, address } = await this.deployPrizePoolContract(createPrizePoolDto);
    prizePool.id = id;

    return this.prizePoolRepository.save(prizePool);
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
    console.log('Event Name:', prizePoolCreatedEvent.name);
    console.log('Event Args:', prizePoolCreatedEvent.args);

    return {
      id: 0, // Get id by smart-contract
      address: prizePoolCreatedEvent.args.toString(),
    };
  }
}
