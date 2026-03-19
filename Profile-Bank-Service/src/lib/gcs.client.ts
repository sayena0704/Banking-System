// src/lib/gcs.client.ts
import { Storage } from "@google-cloud/storage";
import { GCS_CONFIG } from "../config/gcs.config";


export const storage = new Storage({
  projectId: GCS_CONFIG.projectId,


  // Fake GCS support
  apiEndpoint: GCS_CONFIG.isLocal
    ? GCS_CONFIG.fakeGcsEndpoint
    : undefined,
});



