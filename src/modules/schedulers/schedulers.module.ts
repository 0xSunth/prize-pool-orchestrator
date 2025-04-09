import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduler } from './entity/scheduler.entity.js';
import { SchedulersController } from './schedulers.controller.js';
import { SchedulersService } from './schedulers.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduler])],
  controllers: [SchedulersController],
  providers: [SchedulersService],
  exports: [SchedulersService],
})
export class SchedulersModule {}
