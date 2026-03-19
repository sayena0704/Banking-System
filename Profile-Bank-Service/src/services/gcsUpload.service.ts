import { GCS_CONFIG } from "../config/gcs.config";
import { storage } from "../lib/gcs.client";
import { UploadToGCSInput } from "../types/types";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import { AppError } from "../utils/appError";


export const uploadDocumentToGCS = async ({
    file,
    userId,
    documentType,
}: UploadToGCSInput) => {
 
  const ext = file.originalname?.split(".").pop();


  if(!ext) {
    throw new AppError('INVALID_FILE', 400, 'Invalid file');
  }
  const fileName = `${uuid()}.${ext}`;
  console.log('Filename: ', fileName);


  const objectPath = `${documentType}/${userId}/${fileName}`;


  console.log("Upload started");
  console.log("File path:", file.filepath);
  console.log("Bucket:", GCS_CONFIG.bucketName);
  const bucket = storage.bucket(GCS_CONFIG.bucketName);
  const blob = bucket.file(objectPath);


   const fileBuffer = await fs.readFile(file.filepath);
  await blob.save(fileBuffer, {
    contentType: file.mimetype,
    resumable: false,
  });


  console.log(" Uploaded to GCS:", objectPath);
  return {
    objectPath,
    bucket: GCS_CONFIG.bucketName,
   };
};

