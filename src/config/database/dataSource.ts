import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { throwMissingEnvError } from '../../utils/env';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: throwMissingEnvError('DATABASE_HOST'),
  port: parseInt(throwMissingEnvError('DATABASE_PORT')),
  username: throwMissingEnvError('DATABASE_USER'),
  password: throwMissingEnvError('DATABASE_PASSWORD'),
  database: throwMissingEnvError('DATABASE_NAME'),
  entities: [join(__dirname, '../../modules/**/entities/*.entity.{js,ts}')],
  migrations: [join(__dirname, './migrations/*.{js,ts}')],
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
