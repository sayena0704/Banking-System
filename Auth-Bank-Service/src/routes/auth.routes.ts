import Router from "@koa/router";
import { register } from "../controllers/register.controller";
import { verifyOtp } from "../controllers/verifyOtp.controller";
import { login, logout, refreshTokenController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { resendOtpController } from "../controllers/resendOtp.controller";




const router = new Router({prefix: '/auth'});


router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokenController);
router.post('/verify-otp', verifyOtp);
router.post("/logout", authMiddleware, logout);
router.post("/resend-otp", resendOtpController);




export default router;
