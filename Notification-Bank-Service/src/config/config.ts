import dotenv from 'dotenv';
import { jwt } from 'zod';

dotenv.config();
export const config = {
    app: {
        port: Number(process.env.PORT) || 3002
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
    },
    services: {
        authServiceUrl: process.env.AUTH_SERVICE_URL!,
    },
}