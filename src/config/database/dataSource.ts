import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dirname, join, resolve } from 'path';
import { throwMissingEnvError } from '../../utils/env.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: throwMissingEnvError('DATABASE_HOST'),
  port: parseInt(throwMissingEnvError('DATABASE_PORT')),
  username: throwMissingEnvError('DATABASE_USER'),
  password: throwMissingEnvError('DATABASE_PASSWORD'),
  database: throwMissingEnvError('DATABASE_NAME'),
  entities: [resolve(__dirname, '../../modules/**/entity/*.entity.js')],
  migrations: [resolve(__dirname, '../../config/database/migrations/*.js')],
  synchronize: false,
  entitySkipConstructor: true,
  logging: false,
  migrationsRun: false,
  ssl: false,
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default dataSource;
