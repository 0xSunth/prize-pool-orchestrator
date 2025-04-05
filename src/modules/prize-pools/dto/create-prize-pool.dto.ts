import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNumber,
  IsPositive,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class BonusConfigDto {
  @ApiProperty({ example: 100, description: 'Bonus amount granted per epoch (per user)' })
  @IsNumber()
  @IsPositive()
  bonusPerEpoch!: number;

  @ApiProperty({ example: 1000, description: 'Maximum bonus a user can receive' })
  @IsNumber()
  @IsPositive()
  maxBonus!: number;

  @ApiProperty({ example: 10, description: 'Decay of the bonus per epoch' })
  @IsNumber()
  @IsPositive()
  decayPerEpoch!: number;
}

class EpochConfigDto {
  @ApiProperty({ example: 86400, description: 'Epoch duration in seconds (e.g. 1 day)' })
  @IsNumber()
  @IsPositive()
  epochDuration!: number;

  @ApiProperty({ example: 3600, description: 'Entry deadline in seconds before epoch ends' })
  @IsNumber()
  @IsPositive()
  entryDeadline!: number;

  @ApiProperty({ example: 100, description: 'Maximum number of participants per epoch' })
  @IsNumber()
  @IsPositive()
  maxParticipants!: number;
}

class ParticipationRulesDto {
  @ApiProperty({ example: 50, description: 'Minimum deposit amount required to participate' })
  @IsNumber()
  @IsPositive()
  minDepositAmount!: number;

  @ApiProperty({ example: 10, description: 'Maximum withdrawal fee (in %) or fixed units' })
  @IsNumber()
  @IsPositive()
  maxWithdrawFee!: number;
}

export class CreatePrizePoolDto {
  @ApiProperty({ example: '0x123...', description: 'Owner address of the PrizePool' })
  @IsEthereumAddress()
  owner!: string;

  @ApiProperty({ example: '0x456...', description: 'Vault address managing user funds' })
  @IsEthereumAddress()
  vault!: string;

  @ApiProperty({ example: '0x789...', description: 'Address receiving platform fees' })
  @IsEthereumAddress()
  feeRecipient!: string;

  @ApiProperty({ example: '0xabc...', description: 'Treasury address for unused funds' })
  @IsEthereumAddress()
  treasury!: string;

  @ApiProperty({ type: BonusConfigDto })
  @ValidateNested()
  @Type(() => BonusConfigDto)
  bonusConfig!: BonusConfigDto;

  @ApiProperty({ type: EpochConfigDto })
  @ValidateNested()
  @Type(() => EpochConfigDto)
  epochConfig!: EpochConfigDto;

  @ApiProperty({ type: ParticipationRulesDto })
  @ValidateNested()
  @Type(() => ParticipationRulesDto)
  participationRules!: ParticipationRulesDto;
}
