import prisma from "./prisma";


export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully!");


    const users = await prisma.user.findMany();
    console.log("Users:", users);


    await prisma.$disconnect();
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
  }
}


testConnection();



