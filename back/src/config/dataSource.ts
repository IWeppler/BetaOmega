import { DataSource } from "typeorm";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./envs";
import { User } from "../entities/User";
import { Credential } from "../entities/Credential";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true, // Cuidado: en producción, usa migraciones en lugar de synchronize
  dropSchema: false, // Cambia a true para depurar
  logging: false,
  entities: [User, Credential],
  subscribers: [],
  migrations: [],
});
