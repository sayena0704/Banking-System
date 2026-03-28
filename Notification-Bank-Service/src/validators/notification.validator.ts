import { NotificationType } from "@prisma/client";
import { z } from "zod";    

export const createNotificationSchema = z.object({
    type: z.nativeEnum(NotificationType),
    title: z.string().optional(),
    message: z.string().min(1),
});

export const getNotificationQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    isRead: z.string().optional(),
});

export const notificationIdParamSchema = z.object({
    id: z.string().uuid(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type GetNotificationQuery = z.infer<typeof getNotificationQuerySchema>;      
export type NotificationIdParam = z.infer<typeof notificationIdParamSchema>;