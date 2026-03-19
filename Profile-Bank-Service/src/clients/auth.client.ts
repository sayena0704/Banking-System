import axios from "axios";
import { config } from "../config/config";
import { AppError } from "../utils/appError";


const authClient = axios.create({
  baseURL: config.services.authServiceUrl,
  timeout: 5000,
});


export const changePasswordInAuthService = async ({
  userId,
  currentPassword,
  newPassword,
  accessToken,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
  accessToken: string;
}) => {
  try {
    const response = await authClient.post(
      "/auth/change-password",
      {
        userId,
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );


    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "PASSWORD_CHANGE_FAILED",
        error.response.status
      );
    }


    throw new AppError("AUTH_SERVICE_UNAVAILABLE", 503);
  }
};



