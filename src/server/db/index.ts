import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import Elysia from "elysia";

const poolConnection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const db = drizzle({
  client: poolConnection,
  schema: schema,
  mode: "default",
});

export const elysiaDb = new Elysia({ name: "DB" }).decorate("db", db);
