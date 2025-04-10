import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchedulersService } from './schedulers.service.js';

@Controller('schedulers')
export class SchedulersController {
  constructor(private readonly schedulersService: SchedulersService) {}

  @Get('active')
  getActiveSchedulers() {
    const active = this.schedulersService.getActiveTimeouts();
    return {
      count: active.length,
      schedulers: active,
    };
  }

  // Only callable by keeper
  @Post('executed')
  async confirmExecution(@Body('prizePoolAddress') prizePoolAddress: string) {
    try {
      return await this.schedulersService.schedulerExecuted(prizePoolAddress);
    } catch (error) {
      console.error('Error in confirmExecution:', error);
      throw error;
    }
  }

  // In case of Emergency
  @Get('run/:id')
  async runSchedulerManually(@Param('id') id: number) {
    await this.schedulersService.runScheduler(id);
    return { message: `Scheduler ${id} triggered manually.` };
  }
}
