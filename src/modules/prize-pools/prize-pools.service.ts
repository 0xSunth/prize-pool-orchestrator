import { Injectable } from '@nestjs/common';
import { CreatePrizePoolDto } from './dto/create-prize-pool.dto.js';
import { PrizePool } from './entity/prize-pool.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';
import prizePoolFactoryAbi from '../../global/abis/prize-pool-factory.json' with { type: 'json' };
import { safeTx } from '../../utils/ethers.js';

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

    const receipt = await safeTx({
      contract: prizePoolFactoryContract,
      functionName: 'createPrizePool',
      provider: this.provider,
      options: {
        gasBuffer: 1.2,
        logPrefix: 'FACTORY_PRIZE_POOL_CREATION',
        args: [],
      },
    });
    if (receipt) {
      const prizePoolCreatedEvent = receipt.logs
        .map((log) => {
          try {
            return prizePoolFactoryContract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((parsedLog) => parsedLog?.name === 'PrizePoolCreated');

      if (prizePoolCreatedEvent) {
        console.log('Event Name:', prizePoolCreatedEvent.name);
        console.log('Event Args:', prizePoolCreatedEvent.args);
      } else {
        console.warn('PrizePoolCreated event not found.');
      }
    }

    return {
      id: 0,
      address: '',
    };
  }
}
