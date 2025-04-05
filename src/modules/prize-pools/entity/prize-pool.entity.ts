import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreatePrizePoolDto } from '../dto/create-prize-pool.dto';

class BonusConfig {
  @Column('bigint')
  bonusPerEpoch: number;

  @Column('bigint')
  maxBonus: number;

  @Column('bigint')
  decayPerEpoch: number;

  constructor(props: BonusConfig) {
    this.bonusPerEpoch = props.bonusPerEpoch;
    this.maxBonus = props.maxBonus;
    this.decayPerEpoch = props.decayPerEpoch;
  }
}

class EpochConfig {
  @Column('bigint')
  epochDuration: number;

  @Column('bigint')
  entryDeadline: number;

  @Column('bigint')
  maxParticipants: number;

  constructor(props: EpochConfig) {
    this.epochDuration = props.epochDuration;
    this.entryDeadline = props.entryDeadline;
    this.maxParticipants = props.maxParticipants;
  }
}

class ParticipationRules {
  @Column('bigint')
  minDepositAmount: number;

  @Column('bigint')
  maxWithdrawFee: number;

  constructor(props: ParticipationRules) {
    this.minDepositAmount = props.minDepositAmount;
    this.maxWithdrawFee = props.maxWithdrawFee;
  }
}

interface PrizePoolProps {
  id?: number;
  owner: string;
  vault: string;
  feeRecipient: string;
  treasury: string;
  bonusConfig: BonusConfig;
  epochConfig: EpochConfig;
  participationRules: ParticipationRules;
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

  @Column(type => BonusConfig)
  bonusConfig: BonusConfig;

  @Column(type => EpochConfig)
  epochConfig: EpochConfig;

  @Column(type => ParticipationRules)
  participationRules: ParticipationRules;

  constructor(props: PrizePoolProps) {
    if (props.id !== undefined) {
        this.id = props.id;
    }
    this.owner = props.owner;
    this.vault = props.vault;
    this.feeRecipient = props.feeRecipient;
    this.treasury = props.treasury;
    this.bonusConfig = props.bonusConfig;
    this.epochConfig = props.epochConfig;
    this.participationRules = props.participationRules;
  }

  static fromDto(dto: CreatePrizePoolDto): PrizePool {
    return new PrizePool({
      owner: dto.owner,
      vault: dto.vault,
      feeRecipient: dto.feeRecipient,
      treasury: dto.treasury,
      bonusConfig: new BonusConfig({
        bonusPerEpoch: dto.bonusConfig.bonusPerEpoch,
        maxBonus: dto.bonusConfig.maxBonus,
        decayPerEpoch: dto.bonusConfig.decayPerEpoch,
      }),
      epochConfig: new EpochConfig({
        epochDuration: dto.epochConfig.epochDuration,
        entryDeadline: dto.epochConfig.entryDeadline,
        maxParticipants: dto.epochConfig.maxParticipants,
      }),
      participationRules: new ParticipationRules({
        minDepositAmount: dto.participationRules.minDepositAmount,
        maxWithdrawFee: dto.participationRules.maxWithdrawFee,
      }),
    });
  }
}
