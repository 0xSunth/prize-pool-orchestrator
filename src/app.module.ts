import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import base from './config/base.config.js';
import database from './config/database.config.js';
import { DatabaseModule } from './config/database/database.module.js';
import { PrizePoolsModule } from './modules/prize-pools/prize-pools.module.js';
import { SchedulersModule } from './modules/schedulers/schedulers.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      isGlobal: true,
      load: [base, database],
    }),
    DatabaseModule,
    PrizePoolsModule,
    SchedulersModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
