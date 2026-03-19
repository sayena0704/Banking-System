import { Context } from "koa";
import { changePassword } from "../services/security.service";
import { changePasswordSchema } from "../validators/password.validator";


export const changePasswordController = async (ctx: Context) => {
  const userId = ctx.state.user.userId;
  const accessToken = ctx.headers.authorization?.split(" ")[1];


  if (!accessToken) {
    ctx.throw(401, "AUTH_TOKEN_MISSING");
  }


  const body = changePasswordSchema.parse(ctx.request.body);


  await changePassword({
    userId,
    currentPassword: body.currentPassword,
    newPassword: body.newPassword,
    accessToken,
  });


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Password changed successfully",
  };
};

