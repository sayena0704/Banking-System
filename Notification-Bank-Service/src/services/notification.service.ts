import { NotificationStatus } from "@prisma/client";
import prisma from "../db/prisma";
import { CreateNotificationInput } from "../types/types";

export const createNotification = async (input: CreateNotificationInput) => {
    const notification = await prisma.notification.create({
        data: {
            userId: input.userId,
            email: input.email,
            type: input.type,
            title: input.title,
            message: input.message,
            status: NotificationStatus.PENDING
        }
    });
    return notification;
};

export const getNotifications = async (
    userId: string,
    page: number,
    limit: number,
    isRead?: boolean) => {
    const skip = (page - 1) * limit;

    return await prisma.notification.findMany({
        where: {
            userId,
            ...(isRead !== undefined && { isRead }),
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
    });
};

export const markNotificationAsRead = async (id: string) => {
    return await prisma.notification.update({
        where: { id },
        data: { isRead: true }
    });
};