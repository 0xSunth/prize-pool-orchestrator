import { Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post(':address/executed')
  async confirmExecution(@Param('address') address: string) {
    try {
      return await this.schedulersService.schedulerExecuted(address);
    } catch (error) {
      console.error('Error in confirmExecution:', error);
      throw error;
    }
  }

  // Juste pour test faut pas que j'oublie d'enlever
  @Get('run/:id')
  async runSchedulerManually(@Param('id') id: number) {
    await this.schedulersService.runScheduler(id);
    return { message: `Scheduler ${id} triggered manually.` };
  }
}
