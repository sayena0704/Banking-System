










import { Context, Next } from "koa";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { JwtPayload } from "../types/types";
import { AppError } from "../utils/appError";




export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError("AUTH_TOKEN_MISSING", 401);
  }


  const token = authHeader.split(' ')[1];
  // console.log(token);
  let decoded: JwtPayload;


  try {
    decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    ) as JwtPayload;
  } catch {
    throw new AppError("INVALID_OR_EXPIRED_TOKEN", 401);
  }


  // console.log(decoded);


  if (decoded.type !== 'access') {
    throw new AppError("INVALID_TOKEN_TYPE", 401);
  }


  ctx.state.user = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };


  await next();
};
