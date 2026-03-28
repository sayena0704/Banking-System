import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { JwtPayload } from "../types/types";
import { AppError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Auth token missing", 401, ErrorCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
  } catch {
    throw new AppError(
      "Invalid or expired token",
      401,
      ErrorCodes.UNAUTHORIZED
    );
  }

  if (decoded.type !== "access") {
    throw new AppError("Invalid token type", 401, ErrorCodes.UNAUTHORIZED);
  }

  ctx.state.user = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };

  await next();
};