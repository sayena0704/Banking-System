// src/middlewares/user.middleware.ts

import { Context, Next } from "koa";
import { AppError } from "../utils/appError";

export const userMiddleware = async (ctx: Context, next: Next) => {
  const user = ctx.state.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.role !== "USER") {
    throw new AppError("Forbidden: Only general users allowed", 403);
  }

  await next();
};