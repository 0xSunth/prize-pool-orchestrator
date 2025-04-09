import { Controller, Get, Param } from '@nestjs/common';
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

  // Juste pour test faut pas que j'oublie d'enlever
  @Get('run/:id')
  async runSchedulerManually(@Param('id') id: number) {
    await this.schedulersService.runScheduler(id);
    return { message: `Scheduler ${id} triggered manually.` };
  }
}
