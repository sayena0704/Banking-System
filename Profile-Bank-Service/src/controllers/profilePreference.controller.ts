import { Context } from "koa";
import {
  getProfilePreferences,
  updateProfilePreferences,
} from "../services/profilePreference.service";


export const getPreferencesController = async (ctx: Context) => {
  const userId = ctx.state.user.userId;


  const preferences = await getProfilePreferences(userId);


  ctx.status = 200;
  ctx.body = {
    success: true,
    data: preferences,
  };
};


export const updatePreferencesController = async (ctx: Context) => {
  const userId = ctx.state.user.userId;
  const body = ctx.request.body as {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  };


  const updatedPreferences = await updateProfilePreferences(userId, body);


  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "Preferences updated successfully",
    data: updatedPreferences,
  };
};



