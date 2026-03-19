




import Router from "@koa/router";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProfileController, getProfile, updateProfileController } from "../controllers/profile.controller";
import { approveDocumentController, getDocumentStatusController, listDocumentsController, listPendingDocumentsController, rejectDocumentController, resubmitDocumentController, uploadDocumentController } from "../controllers/document.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { getPreferencesController, updatePreferencesController } from "../controllers/profilePreference.controller";
import { changePasswordController } from "../controllers/security.controller";


const router = new Router({ prefix: '/profile'});


router.get('/', authMiddleware,getProfile);
router.post('/', authMiddleware,createProfileController);
router.put("/", authMiddleware, updateProfileController);
router.post("/documents", authMiddleware, uploadDocumentController);
router.get("/documents", authMiddleware, listDocumentsController);
router.get(
  "/documents/:id/status",
  authMiddleware,
  getDocumentStatusController
);
router.put(
  "/documents/:id/resubmit",
  authMiddleware,
  resubmitDocumentController
);
router.get("/admin/documents", authMiddleware, adminMiddleware, listPendingDocumentsController);
router.post("/admin/documents/:id/approve", authMiddleware, adminMiddleware, approveDocumentController);
router.post("/admin/documents/:id/reject", authMiddleware, adminMiddleware, rejectDocumentController);


router.get(
  "/preferences",
  authMiddleware,
  getPreferencesController
);


router.put(
  "/preferences",
  authMiddleware,
  updatePreferencesController
);


router.post(
  "/security/password",
  authMiddleware,
  changePasswordController
);




export default router;

