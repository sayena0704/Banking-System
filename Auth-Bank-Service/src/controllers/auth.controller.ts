// src/controllers/auth.controller.ts
import { Context } from "koa";
import { loginUser } from "../services/login.service";
import { refreshTokens } from "../services/token.service";
import { LoginBody, LogoutBody, RefreshBody } from "../types/types";
import { logoutUser } from "../services/logout.service";


export const login = async (ctx: Context) => {


    const body = ctx.request.body as LoginBody;
    console.log('LOGIN BODY: ', body);
    const result = await loginUser(body);
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: "Login successful",
        data: result,
    };


};


export const refreshTokenController = async (ctx: Context) => {
    const body = ctx.request.body as RefreshBody;
    const { refreshToken } = body;


    if (!refreshToken) {
        const err = new Error("Refresh token required");
        (err as any).status = 400;
        throw err;
    }


    const tokens = await refreshTokens(refreshToken);
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: "Token refreshed successfully",
        data: tokens,
    };


};


export const logout = async (ctx: Context) => {
    const { refreshToken } = ctx.request.body as LogoutBody;


    if (!refreshToken) {
        const err = new Error("Refresh token required");
        (err as any).status = 400;
        throw err;
    }


    const result = await logoutUser(refreshToken);


    ctx.status = 200;
    ctx.body = {
        success: true,
        ...result,
    };
};
