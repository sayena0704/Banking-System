import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { JwtPayload } from "../types/types";


export const authMiddleware = async (ctx: Context, next: Next) => {


    const authHeader = ctx.headers.authorization;


    if(!authHeader || !authHeader.startsWith('Bearer')) {
        ctx.status = 401;
        ctx.body = { message: 'Authorization token missing'};
        return;
    }


    const token = authHeader.split(' ')[1];


    try {
        const decoded = jwt.verify(
            token,
            config.jwt.accessSecret
        ) as JwtPayload;


        if(decoded.type !== 'access'){
            ctx.status = 401;
            ctx.body = { message : 'Invalid token type'};
            return;
        }


        ctx.state.user = {
            userId : decoded.userId,
            email : decoded.email,
            role: decoded.role
        };


        await next();
    } catch (error) {
        ctx.status = 401;
        ctx.body = { message: 'Invalid or expired token'};
    }
};
