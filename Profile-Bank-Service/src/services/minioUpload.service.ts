import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/minio.client";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import { MINIO_CONFIG } from "../config/minio.config";

export const uploadDocumentToMinio = async ({
  file,
  userId,
  documentType,
}: any) => {

  const ext =
    file.originalFilename?.split(".").pop() || "pdf";

  const fileName = `${uuid()}.${ext}`;
  const objectKey = `${documentType}/${userId}/${fileName}`;

  const fileBuffer = await fs.readFile(file.filepath);

  await s3.send(
    new PutObjectCommand({
      Bucket: MINIO_CONFIG.bucket,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: file.mimetype,
    })
  );

  console.log("✅ Uploaded to MinIO:", objectKey);

  return {
    objectPath: objectKey,
    bucket: MINIO_CONFIG.bucket,
  };
};