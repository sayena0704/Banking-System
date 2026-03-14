import prisma from "../db/prisma";


export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });


  return { message: "Logged out successfully" };
};



