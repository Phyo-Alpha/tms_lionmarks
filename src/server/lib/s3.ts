// S3 configuration
import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@/server/config/env";

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT ?? "",
  region: env.S3_REGION ?? "us-east-1",
  credentials: env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
    ? {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      }
    : undefined,
  forcePathStyle: true,
});

export const BUCKET_NAME = env.S3_BUCKET_NAME ?? "";
export const DOWNLOAD_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

export const getDownloadPresignedUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: DOWNLOAD_EXPIRES_IN,
  });

  return url;
};
