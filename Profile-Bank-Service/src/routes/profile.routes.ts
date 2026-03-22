




import Router from "@koa/router";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProfileController, getProfile, updateProfileController } from "../controllers/profile.controller";
import { approveDocumentController, getDocumentStatusController, listDocumentsController, listPendingDocumentsController, rejectDocumentController, resubmitDocumentController, uploadDocumentController } from "../controllers/document.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { getPreferencesController, updatePreferencesController } from "../controllers/profilePreference.controller";
import { changePasswordController } from "../controllers/security.controller";
import { userMiddleware } from "../middlewares/user.middleware";


const router = new Router({ prefix: '/profile'});


router.get('/', authMiddleware,userMiddleware,getProfile);
router.post('/', authMiddleware,userMiddleware, createProfileController);
router.put("/", authMiddleware, updateProfileController);
router.post("/documents", authMiddleware, userMiddleware, uploadDocumentController);
router.get("/documents", authMiddleware,userMiddleware, listDocumentsController);
router.get(
  "/documents/:id/status",
  authMiddleware, userMiddleware,
  getDocumentStatusController
);
router.put(
  "/documents/:id/resubmit",
  authMiddleware, userMiddleware,
  resubmitDocumentController
);
router.get("/admin/documents", authMiddleware, adminMiddleware, listPendingDocumentsController);
router.post("/admin/documents/:id/approve", authMiddleware, adminMiddleware, approveDocumentController);
router.post("/admin/documents/:id/reject", authMiddleware, adminMiddleware, rejectDocumentController);


router.get(
  "/preferences",
  authMiddleware,
  userMiddleware,
  getPreferencesController
);


router.put(
  "/preferences",
  authMiddleware,
  userMiddleware,
  updatePreferencesController
);


router.post(
  "/security/password",
  authMiddleware,
  userMiddleware,
  changePasswordController
);




export default router;

