import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ROOT_ENV_PATH } from '../config/root-env';

dotenv.config({ path: ROOT_ENV_PATH, quiet: true });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
