import { Context } from "koa";
import { registerUser } from "../services/register.service";
import { registerSchema } from "../validators/register.validator";


export const register = async (ctx: Context) => {


  const validatedData = registerSchema.parse(ctx.request.body);
  const { email, password, role, adminSecret } = validatedData;


  const result = await registerUser(email, password, role, adminSecret);


  ctx.status = 201;
  ctx.body = {
    success: true,
    message: 'Registration initiated. OTP sent for verification',
    data: result,
  };


};



