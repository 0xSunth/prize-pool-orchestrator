import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import base from './config/base.config';
import database from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      isGlobal: true,
      load: [base, database],
    }),
  ],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
