export interface JwtPayload {
    userId: string;
    email?: string;
    type: 'access' | 'refresh';
    role: 'USER' | 'ADMIN';
    issuedAt: number;
    expiredAt: number;
};


// document.types.ts
export type CreateProfileDocumentInput = {
  type: "AADHAR" | "PAN" | "PASSPORT" | "ADDRESS_PROOF";
  fileUrl: string;
};
export interface UploadToGCSInput {
  file: any; // koa-body file
  userId: string;
  documentType: string;
};

import "koa";


declare module "koa" {
  interface Request {
    files?: {
      [key: string]: any;
    };
  }
};


export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";