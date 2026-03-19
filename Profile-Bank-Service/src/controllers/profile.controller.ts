




import { Context } from "koa";
import { createProfile, getProfileByUserId, updateProfile } from "../services/profile.service";
import { createProfileSchema, updateProfileSchema } from "../validators/profile.validator";
import { correlationId } from "../middlewares/correlation.middleware";
import { AppError } from "../utils/appError";


export const getProfile = async (ctx: Context) => {
    const userId = ctx.state.user.userId;


    const profile = await getProfileByUserId(userId);


    ctx.status = 200;
    ctx.body = {
        success: true,
        data: profile
    };
};


export const createProfileController = async (ctx: Context) => {
    const userId = ctx.state.user.userId;
    const payload = createProfileSchema.parse(ctx.request.body);
    const profile = await createProfile(userId, payload);


    ctx.status = 201;
    ctx.body = {
        success: true,
        message: "Profile created successfully",
        data: profile,
        correlationId: ctx.state.correlationId,
    };
};


export const updateProfileController = async (ctx: Context) => {
  const userId = ctx.state.user.userId;


  const data = updateProfileSchema.parse(ctx.request.body);


  if (Object.keys(data).length === 0) {
    throw new AppError(
    "Provide at least one field to update",
    400,
    "NO_FIELDS_TO_UPDATE"
  );
  }


  const profile = await updateProfile(userId, data);


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Profile updated successfully",
    data: profile,
  };
};
