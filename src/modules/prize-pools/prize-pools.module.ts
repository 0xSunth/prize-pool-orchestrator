import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizePool } from './entity/prize-pool.entity';
import { PrizePoolsController } from './prize-pools.controller';
import { PrizePoolsService } from './prize-pools.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrizePool])],
  controllers: [PrizePoolsController],
  providers: [PrizePoolsService],
  exports: [PrizePoolsService],
})
export class PrizePoolsModule {}
