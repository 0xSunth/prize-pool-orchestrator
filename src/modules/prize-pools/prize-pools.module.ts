import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizePool } from './entity/prize-pool.entity.js';
import { PrizePoolsController } from './prize-pools.controller.js';
import { PrizePoolsService } from './prize-pools.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PrizePool])],
  controllers: [PrizePoolsController],
  providers: [PrizePoolsService],
  exports: [PrizePoolsService],
})
export class PrizePoolsModule {}
