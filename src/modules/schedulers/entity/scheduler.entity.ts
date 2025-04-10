import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PrizePool } from '../../prize-pools/entity/prize-pool.entity.js';

interface SchedulerProps {
  id?: number;
  prizePool: PrizePool;
  lastExecution?: Date;
  nextExecution?: Date;
  status?: 'idle' | 'running' | 'error';
  retryAt?: Date;
  notes?: string;
}

@Entity('schedulers')
export class Scheduler {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => PrizePool, (prizePool) => prizePool.scheduler, { onDelete: 'CASCADE' })
  @JoinColumn()
  prizePool!: Relation<PrizePool>;

  @Column({ type: 'timestamp', nullable: true })
  lastExecution?: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextExecution?: Date;

  @Column({ type: 'varchar', length: 20, default: 'idle' })
  status: 'idle' | 'running' | 'error' = 'idle';

  @Column({ type: 'timestamp', nullable: true })
  retryAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  constructor(props: SchedulerProps) {
    if (props.id !== undefined) this.id = props.id;
    this.prizePool = props.prizePool;
    this.lastExecution = props.lastExecution;
    this.nextExecution = props.nextExecution;
    this.status = props.status ?? 'idle';
    this.retryAt = props.retryAt;
    this.notes = props.notes;
  }

  static fromPrizePool(prizePool: PrizePool): Scheduler {
    return new Scheduler({
      prizePool,
      lastExecution: undefined,
      nextExecution: undefined,
      status: 'idle',
    });
  }
}
