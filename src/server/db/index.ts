// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import Elysia from "elysia";

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  schema: schema,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_SSL === "true",
  },
});

export const elysiaDb = new Elysia({ name: "DB" }).decorate("db", db);
