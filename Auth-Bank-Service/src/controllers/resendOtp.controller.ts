import { Context } from "koa";
import { resendOtp } from "../services/otp.service";
import { AppError } from "../utils/appError";


export const resendOtpController = async (ctx: Context) => {
    const { email } = ctx.request.body as { email: string };


    if (!email) {
        throw new AppError("Email is required", 400);
    }


    const result = await resendOtp(email);


    ctx.status = 200;
    ctx.body = {
        success: true,
        message: "OTP resent successfully",
        data: result,
    };
}