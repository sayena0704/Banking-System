import { changePasswordInAuthService } from "../clients/auth.client";


export const changePassword = async ({
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
  return changePasswordInAuthService({
    userId,
    currentPassword,
    newPassword,
    accessToken,
  });
};



