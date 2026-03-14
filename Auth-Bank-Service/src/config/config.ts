import dotenv from 'dotenv';
import { JwtExpiry } from '../types/types';


dotenv.config();


export const config = {
    app: {
        port: Number(process.env.PORT) || 3001,
    },


    db: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        name: process.env.DB_NAME!,


    },


    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiry:
            (process.env.ACCESS_TOKEN_EXPIRY as JwtExpiry) || "15m",
        refreshExpiry:
            (process.env.REFRESH_TOKEN_EXPIRY as JwtExpiry) || "7d",
        refreshTokenDays:
            Number(process.env.REFRESH_TOKEN_DAYS) || 7,
    },


    otp: {
        expiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 5,
    },


    security: {
        bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    },


};

