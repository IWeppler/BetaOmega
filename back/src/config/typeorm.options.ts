import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const typeOrmConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../../dist/migrations/*{.ts,.js}'],
  synchronize: true,
  dropSchema: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
