import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scheduler } from './entity/scheduler.entity.js';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SchedulersService implements OnModuleInit {
  private activeTimeouts = new Map<number, NodeJS.Timeout>();
  private timeoutDeadlines = new Map<number, number>();

  constructor(
    @InjectRepository(Scheduler)
    private readonly schedulerRepository: Repository<Scheduler>,
    private configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    console.log('[SchedulerService] Loading idle schedulers...');
    const schedulers = await this.schedulerRepository.find({
      where: { status: 'idle' },
    });
    for (const scheduler of schedulers) {
      this.schedule(scheduler);
    }
  }

  getActiveTimeouts(): { schedulerId: number; timeRemaining: number }[] {
    const now = Date.now();
    const result = [];

    for (const [schedulerId, deadline] of this.timeoutDeadlines.entries()) {
      result.push({
        schedulerId,
        timeRemaining: Math.max(0, Math.round((deadline - now) / 1000)), // in seconds
      });
    }

    return result;
  }

  private schedule(scheduler: Scheduler) {
    if (!scheduler.nextExecution) {
      console.warn(`Scheduler ${scheduler.id} has no nextExecution`);
      return;
    }

    const delay = scheduler.nextExecution.getTime() - Date.now();
    if (delay <= 0) {
      console.warn(`[Scheduler ${scheduler.id}] Missed execution. Running now.`);
      this.runScheduler(scheduler.id);
      return;
    }

    const timeout = setTimeout(() => {
      this.runScheduler(scheduler.id);
      this.activeTimeouts.delete(scheduler.id);
      this.timeoutDeadlines.delete(scheduler.id);
    }, delay);

    this.activeTimeouts.set(scheduler.id, timeout);
    this.timeoutDeadlines.set(scheduler.id, Date.now() + delay);
    console.log(`[Scheduler ${scheduler.id}] Scheduled to run in ${Math.round(delay / 1000)}s`);
  }

  async runScheduler(schedulerId: number) {
    const scheduler = await this.schedulerRepository.findOne({
      where: { id: schedulerId },
      relations: ['prizePool'],
    });

    if (!scheduler) return;

    try {
      console.log(`[Scheduler ${scheduler.id}] Starting execution...`);
      scheduler.status = 'running';
      await this.schedulerRepository.save(scheduler);

      const keeperApiUrl = this.configService.get<string>('keeperApi');
      await axios.post(`${keeperApiUrl}/request-random`, {
        prizePoolAddress: scheduler.prizePool.address,
      });
    } catch (err: any) {
      console.error(`[Scheduler ${scheduler.id}] Error: ${err.message}`);
      scheduler.status = 'error';
      scheduler.retryAt = new Date(Date.now() + 1000 * 60 * 60);
      scheduler.notes = `Failed to launch: ${err.message}`;
      await this.schedulerRepository.save(scheduler);
    }
  }

  async schedulerExecuted(prizePoolId: number) {
    const scheduler = await this.schedulerRepository.findOne({
      where: { prizePool: { id: prizePoolId } },
    });

    if (!scheduler) return;

    const now = new Date();
    scheduler.lastExecution = now;
    scheduler.nextExecution = new Date(now.getTime() + Number(scheduler.prizePool.epochDuration));
    scheduler.status = 'idle';
    scheduler.notes = 'Execution confirmed by Keeper';
    await this.schedulerRepository.save(scheduler);

    this.schedule(scheduler);
  }

  async reloadScheduler(schedulerId: number) {
    const scheduler = await this.schedulerRepository.findOne({
      where: { id: schedulerId },
    });

    if (!scheduler) return;

    this.schedule(scheduler);
  }

  cancelScheduler(schedulerId: number) {
    const timeout = this.activeTimeouts.get(schedulerId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTimeouts.delete(schedulerId);
      console.warn(`[Scheduler ${schedulerId}] Timeout cancelled.`);
    }
  }
}
