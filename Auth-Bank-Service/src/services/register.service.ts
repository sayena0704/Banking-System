import prisma from "../db/prisma";
import bcrypt from 'bcryptjs'
import { generateOtp, getOtpExpiry } from "../utils/otp";
import { hashPassword } from "../utils/password";
import { AppError } from "../utils/appError";
export const registerUser = async (
    email: string,
    password: string,
    role?: "USER" | "ADMIN",
    adminSecret?: string
) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });


    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    if (role === "ADMIN") {
        if (adminSecret !== process.env.ADMIN_SECRET) {
            throw new AppError("Unauthorized to create admin", 403);
        }
    }

    const hashedPassword = await hashPassword(password);


    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role || "USER",
            isVerified: false,
        },

    });


    const otp = generateOtp();
    const expiresAt = getOtpExpiry(10);


    await prisma.oTP.create({
        data: {
            userId: newUser.id,
            otp,
            expiresAt
        },
    });


    console.log(`OTP for ${email}: ${otp}`);


    return {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
    }
};







