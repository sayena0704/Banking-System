import prisma from "../db/prisma";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { generateTokens } from "../utils/authToken";
import { AppError } from "../utils/appError";


export const saveRefreshToken = async (
  userId: string,
  token: string
) => {
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + config.jwt.refreshTokenDays
  );


  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};


export const refreshTokens = async (refreshToken: string) => {
  let payload: { userId: string };


  try {
    payload = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret
    ) as { userId: string };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }


  // Check DB for existing token
  const storedToken = await prisma.refreshToken.findFirst({ where: { token: refreshToken } });


  if (!storedToken) {
    await prisma.refreshToken.deleteMany({
      where: { userId: payload.userId},
    });
     throw new AppError(
      "Token reuse detected. Please login again.",
      401
    );
  }


  // Delete old token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });


  // Fetch user
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new AppError("User not found", 404);


  // Generate new tokens
  const tokens = generateTokens(user);


  // Save new refresh token
  await saveRefreshToken(user.id, tokens.refreshToken);


  return tokens;
};





