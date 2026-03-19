



import { Context } from 'koa';


export const healthCheck = async (ctx: Context) => {
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: 'Profile service is healthy',
        timestamp: new Date().toISOString(),
    };
}
