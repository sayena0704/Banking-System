import {Context } from 'koa';


export const healthCheck = async (ctx: Context) => {
    ctx.body = {
        code : 200,
        status: 'healthy',
        message: 'Fraud detection service is healthy',
        timestamp: new Date().toISOString()
    }
}
