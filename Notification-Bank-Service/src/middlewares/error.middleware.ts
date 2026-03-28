import { Context, Next } from "koa";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";


export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {

    if (err instanceof ZodError) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation failed",
        errors: err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        correlationId: ctx.state.correlationId,
      };
      return;
    }

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

