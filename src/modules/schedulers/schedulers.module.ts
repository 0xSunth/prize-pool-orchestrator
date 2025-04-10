import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduler } from './entity/scheduler.entity.js';
import { SchedulersController } from './schedulers.controller.js';
import { SchedulersService } from './schedulers.service.js';
import { PrizePool } from '../prize-pools/entity/prize-pool.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduler]), TypeOrmModule.forFeature([PrizePool])],
  controllers: [SchedulersController],
  providers: [SchedulersService],
  exports: [SchedulersService],
})
export class SchedulersModule {}
