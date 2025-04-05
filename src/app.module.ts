import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import base from './config/base.config';
import database from './config/database.config';
import { DatabaseModule } from './config/database/database.module';
import { PrizePoolsModule } from './modules/prize-pools/prize-pools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      isGlobal: true,
      load: [base, database],
    }),
    DatabaseModule,
    PrizePoolsModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
