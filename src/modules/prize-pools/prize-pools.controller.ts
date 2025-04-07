import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreatePrizePoolDto } from './dto/create-prize-pool.dto.js';
import { PrizePoolsService } from './prize-pools.service.js';
import { PrizePool } from './entity/prize-pool.entity.js';

@ApiTags('PrizePools')
@Controller('prize-pools')
export class PrizePoolsController {
  constructor(private prizePoolsService: PrizePoolsService) {}

  @Post()
  @ApiOperation({ summary: 'Deploy a new PrizePool smart contract' })
  @ApiBody({ type: CreatePrizePoolDto, description: 'Prize pool deployment payload' })
  @ApiCreatedResponse({ description: 'New PrizePool contract successfully deployed' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed – check payload fields' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @ApiForbiddenResponse({ description: 'Unauthorized – you do not have the required permissions' })
  async createPrizePool(@Body() createPrizePoolDto: CreatePrizePoolDto): Promise<PrizePool> {
    try {
      return await this.prizePoolsService.create(createPrizePoolDto);
    } catch (error) {
      console.error('Error in createPrizePool:', error);
      throw error;
    }
  }
}
