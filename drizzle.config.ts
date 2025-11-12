import { defineConfig } from "drizzle-kit";

const databaseHost = process.env.DATABASE_HOST;
const databasePort = process.env.DATABASE_PORT;
const databaseUser = process.env.DATABASE_USERNAME;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

if (!databaseHost || !databasePort || !databaseUser || !databasePassword || !databaseName) {
  throw new Error(
    "DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, and DATABASE_NAME are not set",
  );
}

export default defineConfig({
  dialect: "mysql",
  schema: "./src/server/db/schema",
  out: "./src/db/migrations/app",
  dbCredentials: {
    host: databaseHost,
    port: Number(databasePort),
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
  },
});
