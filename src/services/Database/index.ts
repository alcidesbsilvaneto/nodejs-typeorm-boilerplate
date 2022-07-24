import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? process.env.PWD + "/.env" : process.env.PWD + "/.dev.env",
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [process.env.NODE_ENV === "production" ? "dist/src/modules/**/*.model.js" : "src/modules/**/*.model.ts"],
  migrations: [process.env.NODE_ENV === "production" ? "src/services/Database/migrations/*.js" : "src/services/Database/migrations/*.ts"],
  subscribers: [process.env.NODE_ENV === "production" ? "dist/src/modules/**/*.subscriber.js" : "src/modules/**/*.subscriber.ts"],
});

export default AppDataSource;
