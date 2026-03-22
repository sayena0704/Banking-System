import { Context } from "koa";
import { uploadDocumentSchema } from "../validators/document.validator";
import { approveDocument, getDocumentStatus, listDocuments, listPendingDocuments, rejectDocument, resubmitDocument, uploadDocument } from "../services/document.service";
import { AppError } from "../utils/appError";
import { uploadDocumentToMinio } from "../services/minioUpload.service";


export const uploadDocumentController = async (ctx: Context) => {
    const userId = ctx.state.user.userId;
    console.log(userId);


    const body = uploadDocumentSchema.parse(ctx.request.body);
    const file =
        Array.isArray(ctx.request.files?.file)
            ? ctx.request.files.file[0]
            : ctx.request.files?.file;
    console.log("BODY:", ctx.request.body);
console.log("FILES:", ctx.request.files);
    if (!file) {
        throw new AppError('Document file is required', 400,"FILE_REQUIRED");
    }
    else{
      console.log('file found');
    }


    // Upload to MinIO
    const { objectPath } = await uploadDocumentToMinio({
        file,
        userId,
        documentType: body.type,
    });


    // Save metadata
    const doc = await uploadDocument(userId, {
        type: body.type,
        fileUrl: objectPath,
    });


    ctx.status = 201;
    ctx.body = {
        success: true,
        message: 'Document uploaded successfully',
        data: doc,
        correlationId: ctx.state.correlationId,
    };
};


export const listDocumentsController = async (ctx: Context) => {
    const userId = ctx.state.user.userId;


    const docs = await listDocuments(userId);


    ctx.body = {
        success: true,
        data: docs,
    };
}


export const getDocumentStatusController = async (ctx: Context) => {
    const userId = ctx.state.user.userId;
    const documentId = ctx.params.id;


    if (!documentId) {
        ctx.throw(400, 'Document ID is required');
    }


    const result = await getDocumentStatus(userId, documentId);


    ctx.status = 200;
    ctx.body = {
        success: true,
        data: result
    }
};


export const resubmitDocumentController = async (ctx: Context) => {
  const userId = ctx.state.user.userId;
  const documentId = ctx.params.id;


  const file =
    Array.isArray(ctx.request.files?.file)
      ? ctx.request.files.file[0]
      : ctx.request.files?.file;


  if (!file) {
    throw new AppError("FILE_REQUIRED", 400);
  }


  // upload file
  const { objectPath } = await uploadDocumentToMinio({
    file,
    userId,
    documentType: "UNKNOWN", // resolved inside service
  });


  const updatedDocument = await resubmitDocument(
    userId,
    documentId,
    objectPath
  );


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Document resubmitted successfully",
    data: {
      id: updatedDocument.id,
      status: updatedDocument.status,
      updatedAt: updatedDocument.updatedAt,
    },
  };
};


/**
 * ADMIN: List all pending documents
 */
export const listPendingDocumentsController = async (ctx: Context) => {
  const documents = await listPendingDocuments();


  ctx.status = 200;
  ctx.body = {
    success: true,
    data: documents,
  };
};


/**
 * ADMIN: Approve document
 */
export const approveDocumentController = async (ctx: Context) => {
  const adminUserId = ctx.state.user.userId;
  const documentId = ctx.params.id;


  if (!documentId) {
    throw new AppError("DOCUMENT_ID_REQUIRED", 400);
  }


  const document = await approveDocument(documentId, adminUserId);


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Document approved",
    data: {
      id: document.id,
      status: document.status,
    },
  };
};


/**
 * ADMIN: Reject document
 */
export const rejectDocumentController = async (ctx: Context) => {
  const adminUserId = ctx.state.user.userId;
  const documentId = ctx.params.id;
  const { reason } = ctx.request.body as { reason?: string };


  const document = await rejectDocument(
    documentId,
    adminUserId,
    reason || ""
  );


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Document rejected",
    data: {
      id: document.id,
      status: document.status,
      rejectionReason: document.rejectionReason,
    },
  };
};







