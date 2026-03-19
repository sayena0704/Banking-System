import { Context, Next } from "koa";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";


export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {


    // 🔹 Zod validation errors
    if (err instanceof ZodError) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: err?.message ?? "Invalid request",
        correlationId: ctx.state.correlationId,
      };
      return;
    }


    // 🔹 Known business errors
    if (err instanceof AppError) {
      ctx.status = err.status;
      ctx.body = {
        success: false,
        code: err.code,
        message: err.message,
        correlationId: ctx.state.correlationId,
      };
      return;
    }


    // 🔹 Unknown errors
    console.error("Unhandled error:", err);


    ctx.status = 500;
    ctx.body = {
      success: false,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong",
      correlationId: ctx.state.correlationId,
    };
  }
};

