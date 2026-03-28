import {Context, Next} from 'koa';
import { randomUUID } from 'node:crypto';


export const correlationId = async(ctx: Context, next: Next) => {
    const header = ctx.headers['x-correlation-id'];


    const id = typeof header === 'string' && header.length > 0
    ? header : randomUUID();


    ctx.state.correlationId = id;
    ctx.set("x-correlation-id", id);


  await next();
};
