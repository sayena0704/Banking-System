export const GCS_CONFIG = {
    projectId: process.env.GCS_PROJECT_ID || "test-project",
    bucketName: process.env.GCS_BUCKET || "kyc-documents",
    fakeGcsEndpoint: process.env.FAKE_GCS_ENDPOINT || "http://localhost:4443",
    isLocal: process.env.NODE_ENV !== "production",
}

