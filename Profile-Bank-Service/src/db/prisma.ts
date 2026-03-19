// db/prisma.ts
import { PrismaClient } from "@prisma/client";


// Instantiate PrismaClient (singleton)
const prisma = new PrismaClient();


export default prisma;



