export const healthCheck = async (ctx: any) => {
    ctx.status  = 200;
    ctx.body = {
        success: true,
        message: 'Notification service is healthy',
        timestamp: new Date().toISOString(),
    };
}