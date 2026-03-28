import { Context } from "koa";
import { createNotification, getNotifications, markNotificationAsRead } from "../services/notification.service";
import { CreateNotificationInput } from "../validators/notification.validator";


export const createNotificationController = async (ctx: Context) => {
    const body = ctx.state.validatedBody as CreateNotificationInput;
    const user = ctx.state.user;

    const notificationData = {
        ...body,
        userId: user.userId, 
        email: user.email,
    };

    const notification = await createNotification(notificationData);

    ctx.status = 201;
    ctx.body = {
        success: true,
        data: notification,
        correlationId: ctx.state.correlationId,
    };
};

export const getNotificationsController = async (ctx: Context) => {
    const user = ctx.state.user;
    const query = ctx.state.validatedQuery as {
        page?: string;
        limit?: string;
        isRead?: string;
    };

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const isRead =  query.isRead !== undefined ? query.isRead === "true" : undefined;

    const notifications = await getNotifications(user.userId, page, limit, isRead);

    ctx.body = {
        success: true,
        data: notifications,
        correlationId: ctx.state.correlationId,
    };
};

export const markNotificationAsReadController = async (ctx: Context) => {
    const { id } = ctx.state.validatedParams as { id: string };
    const notification = await markNotificationAsRead(id);

    ctx.body = {
        success: true,
        data: notification,
        correlationId: ctx.state.correlationId,
    };
};