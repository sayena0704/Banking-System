import { config } from '../config/config';
import prisma from '../db/prisma';
import { AppError } from '../utils/appError';
import { generateOtp, getOtpExpiry } from '../utils/otp';


export const verifyOtpService = async (
  email: string,
  otp: string
): Promise<void> => {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });


  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }


  if (user.isVerified) {
    throw new AppError("USER_ALREADY_VERIFIED", 400);
  }


  // 2. Find OTP
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      otp,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  if (!otpRecord) {
    throw new AppError("INVALID_OTP", 400);
  }


  if (otpRecord.expiresAt < new Date()) {
    throw new AppError("OTP_EXPIRED", 400);
  }


  // 3. Mark user verified
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });


  // 4. Delete OTPs
  await prisma.oTP.deleteMany({
    where: { userId: user.id },
  });
};


export const resendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {email},
    });


    if(!user){
        throw new AppError("USER_NOT_FOUND", 404);
    }


    if(user.isVerified) {
        throw new AppError("USER_ALREADY_VERIFIED", 400);
    }


    await prisma.oTP.deleteMany({
      where: { userId: user.id},
    });


    const otp = generateOtp();
    const expiresAt = getOtpExpiry(10);


    await prisma.oTP.create({
    data: {
      userId: user.id,
      otp,
      expiresAt,
    },
  });


  console.log("Resent OTP:", otp);


  return { message: "OTP resent successfully" };
}



