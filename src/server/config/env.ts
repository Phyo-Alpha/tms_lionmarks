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
