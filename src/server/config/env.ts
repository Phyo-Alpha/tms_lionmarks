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
  DATABASE_HOST: z.string().min(1, "DATABASE_HOST is required"),
  DATABASE_PORT: z.string().min(1, "DATABASE_PORT is required"),
  DATABASE_USERNAME: z.string().min(1, "DATABASE_USERNAME is required"),
  DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),

  // Admin Credentials
  ADMIN_USERNAME: z.string().min(1, "ADMIN_USERNAME is required"),
  ADMIN_EMAIL: z.string().min(1, "ADMIN_EMAIL is required"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required"),

  // Better Auth Configuration
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  NEXT_PUBLIC_SERVER_URL: z.string().min(1, "NEXT_PUBLIC_SERVER_URL is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
  // Email Configuration (Optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  // ACRA Configuration (Optional)
  ACRA_API_URL: z.string().optional(),
  ACRA_API_TOKEN: z.string().optional(),
  // Microsoft Graph Configuration (Optional)
  MICROSOFT_GRAPH_TENANT_ID: z.string().optional(),
  MICROSOFT_GRAPH_CLIENT_ID: z.string().optional(),
  MICROSOFT_GRAPH_CLIENT_SECRET: z.string().optional(),
  // S3 Configuration (Optional)
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
});

const env = envSchema.parse(process.env);
export default env;
