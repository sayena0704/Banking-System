import prisma from "../db/prisma";
import { CreateProfileDocumentInput } from "../types/types";
import { AppError } from "../utils/appError";
// import { UploadDocumentInput } from "../validators/document.validator";
type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";
type KycStatus = "PENDING" | "APPROVED" | "REJECTED";


export const uploadDocument = async (
    userId: string,
    data: CreateProfileDocumentInput
) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });


    if (!profile) {
        throw new AppError('Profile not found', 404);
    }


    if (profile.kycStatus === "APPROVED") {
        throw new AppError('KYC already verified. Upload not allowed.', 403);
    }


    const existingDoc = await prisma.profileDocument.findFirst({
        where: {
            profileId: profile.id,
            type: data.type
        }
    });


    if (existingDoc && existingDoc.status !== 'REJECTED') {
        throw new AppError('Document already uploaded', 409);
    }


    if (existingDoc) {
        await prisma.profileDocument.delete({
            where: { id: existingDoc.id },
        });
    }


    return prisma.profileDocument.create({
        data: {
            profileId: profile.id,
            type: data.type,
            fileUrl: data.fileUrl
        }
    });
};


export const listDocuments = async (userId: string) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });


    if (!profile) {
        throw new AppError('Profile not found', 404);
    }


    return prisma.profileDocument.findMany({
        where: {
            profileId: profile.id,
        },
        select: {
            id: true,
            type: true,
            status: true,
            createdAt: true,
        },
    });
};


export const getDocumentStatus = async (
    userId: string,
    documentId: string
) => {
    const doc = await prisma.profileDocument.findUnique({
        where: { id: documentId },
        include: { profile: true },
    });


    if (!doc || doc.profile.userId !== userId) {
        throw new AppError("Document not found", 404);
    }


    return {
        status: doc.status,
        rejectionReason: doc.rejectionReason,
    };
};


export const resubmitDocument = async (
    userId: string,
    documentId: string,
    fileUrl: string
) => {
    const document = await prisma.profileDocument.findUnique({
        where: { id: documentId },
        include: { profile: true },
    });


    if (!document || document.profile.userId !== userId) {
        throw new AppError("DOCUMENT_NOT_FOUND", 404);
    }


    if (document.status !== "REJECTED") {
        throw new AppError("DOCUMENT_NOT_ELIGIBLE_FOR_RESUBMISSION", 400);
    }


    const updatedDocument = await prisma.profileDocument.update({
        where: { id: documentId },
        data: {
            fileUrl,
            status: "PENDING",
            rejectionReason: null,
            verifiedAt: null,
        },
    });


    const documents = await prisma.profileDocument.findMany({
        where: { profileId: document.profileId },
    });


    const kycStatus = calculateKycStatus(documents);


    await prisma.profile.update({
        where: { id: document.profileId },
        data: { kycStatus },
    });


    return updatedDocument;
};


export const calculateKycStatus = (
    documents: { status: DocumentStatus }[]
): KycStatus => {
    if (documents.some(d => d.status === "REJECTED")) {
        return "REJECTED";
    }


    if (
        documents.length > 0 &&
        documents.every(d => d.status === "APPROVED")
    ) {
        return "APPROVED";
    }


    return "PENDING";
};




export const listPendingDocuments = async () => {
    return prisma.profileDocument.findMany({
        where: { status: "PENDING" },
        include: {
            profile: {
                select: {
                    id: true,
                    userId: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
};


export const approveDocument = async (
    documentId: string,
    adminUserId: string
) => {
    const document = await prisma.profileDocument.findUnique({
        where: { id: documentId },
    });


    if (!document) {
        throw new AppError("DOCUMENT_NOT_FOUND", 404);
    }


    if (document.status !== "PENDING") {
        throw new AppError("DOCUMENT_ALREADY_REVIEWED", 400);
    }


    const updatedDocument = await prisma.profileDocument.update({
        where: { id: documentId },
        data: {
            status: "APPROVED",
            verifiedAt: new Date(),
            reviwedAt: new Date(),
            reviwedBy: adminUserId,
            rejectionReason: null,
        },
    });


    await recalculateProfileKycStatus(document.profileId);


    return updatedDocument;
};


export const rejectDocument = async (
    documentId: string,
    adminUserId: string,
    reason: string
) => {
    if (!reason?.trim()) {
        throw new AppError("REJECTION_REASON_REQUIRED", 400);
    }


    const document = await prisma.profileDocument.findUnique({
        where: { id: documentId },
    });


    if (!document) {
        throw new AppError("DOCUMENT_NOT_FOUND", 404);
    }


    if (document.status !== "PENDING") {
        throw new AppError("DOCUMENT_ALREADY_REVIEWED", 400);
    }


    const updatedDocument = await prisma.profileDocument.update({
        where: { id: documentId },
        data: {
            status: "REJECTED",
            rejectionReason: reason,
            reviwedAt: new Date(),
            reviwedBy: adminUserId,
        },
    });


    await recalculateProfileKycStatus(document.profileId);


    return updatedDocument;
};


const recalculateProfileKycStatus = async (profileId: string) => {
    const documents = await prisma.profileDocument.findMany({
        where: { profileId },
        select: { status: true },
    });


    const kycStatus = calculateKycStatus(documents);


    await prisma.profile.update({
        where: { id: profileId },
        data: { kycStatus },
    });
};

