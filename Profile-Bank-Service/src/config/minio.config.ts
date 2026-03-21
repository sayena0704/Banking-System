export const MINIO_CONFIG = {
  endpoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  bucket: process.env.MINIO_BUCKET!,
  region: process.env.MINIO_REGION || "us-east-1",
};