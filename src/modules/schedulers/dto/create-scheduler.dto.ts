import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateSchedulerDto {
  @IsOptional()
  @IsDateString()
  lastExecution?: string;

  @IsOptional()
  @IsDateString()
  nextExecution?: string;

  @IsOptional()
  @IsEnum(['idle', 'running', 'error'])
  status?: 'idle' | 'running' | 'error';

  @IsOptional()
  @IsDateString()
  retryAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
