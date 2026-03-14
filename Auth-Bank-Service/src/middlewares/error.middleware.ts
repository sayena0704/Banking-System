import { Context, Next } from 'koa';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';


export const errorMiddleware = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (error: any) {
        // Zod validation error
        if (error instanceof ZodError) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: "Validation failed",
                errors: error.issues,
                correlationId: ctx.state.correlationId,
            };
            return;
        }

         // AppError (business errors)
    if (error instanceof AppError) {
      ctx.status = error.status;
      ctx.body = {
        success: false,
        message: error.message,
        correlationId: ctx.state.correlationId,
      };
      return;
    }


    console.error("Unhandled error:", error);


    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "Internal server error",
      correlationId: ctx.state.correlationId,
    };
    }
}

