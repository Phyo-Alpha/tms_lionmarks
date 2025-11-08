import { z } from "zod";

declare global {
  interface RequestInit {
    typ?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

const envSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Better Auth Configuration
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  NEXT_PUBLIC_SERVER_URL: z.string().min(1, "NEXT_PUBLIC_SERVER_URL is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
});

const env = envSchema.parse(process.env);
export default env;
