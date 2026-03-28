import { NotificationType } from "@prisma/client";

export interface JwtPayload {
    userId: string;
    email?: string;
    type: 'access' | 'refresh';
    role: 'USER' | 'ADMIN';
    issuedAt: number;
    expiredAt: number;
};

export interface CreateNotificationInput {
    userId: string;
    email: string;
    type: NotificationType;
    title?: string;
    message: string;
}