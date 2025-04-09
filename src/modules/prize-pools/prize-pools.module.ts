import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizePool } from './entity/prize-pool.entity.js';
import { PrizePoolsController } from './prize-pools.controller.js';
import { PrizePoolsService } from './prize-pools.service.js';
import { SchedulersModule } from '../schedulers/schedulers.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PrizePool]), forwardRef(() => SchedulersModule)],
  controllers: [PrizePoolsController],
  providers: [PrizePoolsService],
  exports: [PrizePoolsService],
})
export class PrizePoolsModule {}
