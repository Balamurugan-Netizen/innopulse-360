import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  verifyOtpController
} from "../controllers/auth.controller";
import { loginRateLimiter } from "../middlewares/rate-limit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema, verifyOtpSchema } from "../validators/auth.validator";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);
authRouter.post("/login", loginRateLimiter, validate(loginSchema), loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/logout", logoutController);
