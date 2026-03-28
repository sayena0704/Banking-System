import Router from "@koa/router";
import { correlationId } from "../middlewares/correlation.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createNotificationSchema, getNotificationQuerySchema, notificationIdParamSchema } from "../validators/notification.validator";
import { createNotificationController, getNotificationsController, markNotificationAsReadController } from "../controllers/notification.controller";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateAPI";
import { get } from "node:http";
import { no } from "zod/v4/locales";

const router = new Router({ prefix: '/notifications' });

router.post(
  "/",
//   correlationMiddleware,
  authMiddleware,
  validateBody(createNotificationSchema),
  createNotificationController
);

router.get(
  "/",
//   correlationId,
  authMiddleware,
  validateQuery(getNotificationQuerySchema),
  getNotificationsController
);

router.patch(
    "/:id/read",
    authMiddleware,
    validateParams(notificationIdParamSchema),
    markNotificationAsReadController
);

export default router;