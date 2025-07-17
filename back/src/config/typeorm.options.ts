import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(
      `Error de configuración: La variable de entorno ${varName} no está definida. ` +
        `Asegúrate de que tu archivo .env esté en la carpeta raíz 'back/' y que contenga esta variable.`,
    );
  }
}

export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: 'public', // Clave para Supabase
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false, // Usar migraciones es más seguro
  logging: process.env.NODE_ENV === 'development',
};
