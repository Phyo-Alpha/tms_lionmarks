import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.TIMESCALE_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TIMESCALE_DATABASE_URL is not set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/timescale-schema",
  out: "./src/db/migrations/timescale",
  dbCredentials: {
    url: databaseUrl,
  },
});
