import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreatePrizePoolDto } from '../dto/create-prize-pool.dto.js';

interface PrizePoolProps {
  id?: number;
  owner: string;
  vault: string;
  feeRecipient: string;
  treasury: string;
  bonusPerEpoch: number;
  maxBonus: number;
  decayPerEpoch: number;
  epochDuration: number;
  entryDeadline: number;
  maxParticipants: number;
  minDepositAmount: number;
  maxWithdrawFee: number;
}

@Entity('prize_pools')
export class PrizePool {
  @PrimaryColumn()
  id!: number;

  @Column()
  owner: string;

  @Column()
  vault: string;

  @Column()
  feeRecipient: string;

  @Column()
  treasury: string;

  // Bonus config
  @Column('bigint')
  bonusPerEpoch!: number;

  @Column('bigint')
  maxBonus!: number;

  @Column('bigint')
  decayPerEpoch!: number;

  // Epoch config
  @Column('bigint')
  epochDuration!: number;

  @Column('bigint')
  entryDeadline!: number;

  @Column('bigint')
  maxParticipants!: number;

  // Participation rules
  @Column('bigint')
  minDepositAmount!: number;

  @Column('bigint')
  maxWithdrawFee!: number;

  constructor(props: PrizePoolProps) {
    if (props.id !== undefined) this.id = props.id;
    this.owner = props.owner;
    this.vault = props.vault;
    this.feeRecipient = props.feeRecipient;
    this.treasury = props.treasury;
    this.bonusPerEpoch = props.bonusPerEpoch;
    this.maxBonus = props.maxBonus;
    this.decayPerEpoch = props.decayPerEpoch;
    this.epochDuration = props.epochDuration;
    this.entryDeadline = props.entryDeadline;
    this.maxParticipants = props.maxParticipants;
    this.minDepositAmount = props.minDepositAmount;
    this.maxWithdrawFee = props.maxWithdrawFee;
  }

  static fromDto(dto: CreatePrizePoolDto): PrizePool {
    return new PrizePool({ ...dto });
  }
}
