import { Context, Next } from "koa";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) => async (ctx: Context, next: Next) => {
    const result = schema.safeParse(ctx.request.body);

    if (!result.success) {
      throw result.error;
    }

    ctx.state.validatedBody = result.data; // sanitized
    await next();
  };

export const validateQuery =
  (schema: ZodSchema) => async (ctx: Context, next: Next) => {
    const result = schema.safeParse(ctx.request.query);

    if (!result.success) {
      throw result.error;
    }

    ctx.state.validatedQuery = result.data;
    await next();
  };

export const validateParams =
  (schema: ZodSchema) => async (ctx: Context, next: Next) => {
    const result = schema.safeParse(ctx.params);

    if (!result.success) {
      throw result.error;
    }

    ctx.state.validatedParams = result.data;
    await next();
  };