import { Context, Next } from "koa";
import { AppError } from "../utils/appError";


export const adminMiddleware = async (ctx: Context, next: Next) => {
    if(ctx.state.user.role !== 'ADMIN'){
        throw new AppError('ADMIN_ACCESS_REQUIRED', 403);
    }


    await next();
};
