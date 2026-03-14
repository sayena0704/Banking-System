import { Context } from "koa"
import { verifyOtpSchema } from "../validators/verifyOtp.validator";
import { verifyOtpService } from "../services/otp.service";


export const verifyOtp = async (ctx: Context) => {
    const { email, otp } = verifyOtpSchema.parse(ctx.request.body);


    await verifyOtpService(email, otp);


    ctx.status = 200;
    ctx.body = {
      message: "OTP verified successfully",
    };
};


