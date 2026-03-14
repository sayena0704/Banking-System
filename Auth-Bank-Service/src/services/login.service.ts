import prisma from "../db/prisma";
import bcrypt from "bcryptjs";
import { LoginInput } from "../validators/auth.validator";
import { saveRefreshToken } from "./token.service";
import { generateTokens } from "../utils/authToken";


export const loginUser = async (data: LoginInput) => {


    const { email, password } = data;


    const user = await prisma.user.findUnique({
        where: { email },
    });


    if (!user) {
        const err = new Error("Invalid email or password");
        (err as any).status = 401;
        throw err;
    }


    if (!user.isVerified) {
        const err = new Error("User not verified");
        (err as any).status = 401;
        throw err;
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
        const err = new Error("Invalid email or password");
        (err as any).status = 401;
        throw err;
    }


    const { accessToken, refreshToken } = generateTokens(user);


    await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
    });


    await saveRefreshToken(user.id, refreshToken);


    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
};

