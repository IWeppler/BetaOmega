import dotenv from "dotenv";

dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const PORT: number = Number(process.env.PORT) || 3001;
export const DB_NAME: string = process.env.DB_NAME || "betaomega";
export const DB_USER: string = process.env.DB_USER || "postgres";
export const DB_PASSWORD: string = getEnvVar("DB_PASSWORD");
export const DB_HOST: string = process.env.DB_HOST || "localhost";
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
export const JWT_SECRET: string = getEnvVar("JWT_SECRET");
