import { S3Client } from "@aws-sdk/client-s3";
import { MINIO_CONFIG } from "../config/minio.config";

export const s3 = new S3Client({
  region: MINIO_CONFIG.region,
  endpoint: MINIO_CONFIG.endpoint,
  credentials: {
    accessKeyId: MINIO_CONFIG.accessKey,
    secretAccessKey: MINIO_CONFIG.secretKey,
  },
  forcePathStyle: true,
});