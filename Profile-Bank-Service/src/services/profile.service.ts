import prisma from "../db/prisma"
import { AppError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";
import { CreateProfileInput, UpdateProfileInput } from "../validators/profile.validator";




export const getProfileByUserId = async (userId: string) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });


    if (!profile) {
        throw new AppError(
            "Please complete your profile",
            404,
            ErrorCodes.PROFILE_NOT_CREATED
        );
    }


    return profile;
};


export const createProfile = async (userId: string, data: CreateProfileInput) => {
    const exisitingProfile = await prisma.profile.findUnique({
        where: { userId },
    });


    if (exisitingProfile) {
        throw new AppError(
            "Profile already exists",
            409,
            "PROFILE_ALREADY_EXISTS"
        );
    }


    const profile = await prisma.profile.create({
        data: {
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone ?? null,
            dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth) : null,
            addressLine1: data.addressLine1 ?? null,
            addressLine2: data.addressLine2 ?? null,
            kycStatus: "PENDING",
        }
    });


    return profile;
};


export const updateProfile = async (userId: string,
    data: UpdateProfileInput
) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });


    if (!profile) {
        throw new AppError(
            "Profile already exists",
            409,
            "PROFILE_ALREADY_EXISTS"
        );
    }


    //KYC Lock
    if (profile.kycStatus === 'APPROVED') {
        throw new AppError(
            "Profile cannot be updated after KYC Verification",
            403
        );
    }


    const updateProfile = await prisma.profile.update({
        where: { userId },
        data: {
            ...data,
        }
    });


    return updateProfile;


}

