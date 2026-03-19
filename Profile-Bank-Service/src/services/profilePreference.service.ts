import prisma from "../db/prisma";
import { AppError } from "../utils/appError";


export const getProfilePreferences = async(userId: string) => {


    const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {preferences: true},
    });


    if(!profile) {
        throw new AppError('PROFILE_NOT_FOUND',404);
    }


    if(!profile.preferences) {
        return prisma.profilePreference.create({
            data: {
                profileId: profile.id,
            },
        });
    }


    return profile.preferences;
};


export const updateProfilePreferences = async (
  userId: string,
  data: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  }
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });


  if (!profile) {
    throw new AppError("PROFILE_NOT_FOUND", 404);
  }


  return prisma.profilePreference.upsert({
    where: { profileId: profile.id },
    update: data,
    create: {
      profileId: profile.id,
      ...data,
    },
  });
};

