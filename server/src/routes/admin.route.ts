import { Router } from "express";
import {
  exportReportsController,
  getUsersController,
  setUserApprovalController
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rbacMiddleware } from "../middlewares/rbac.middleware";

export const adminRouter = Router();

adminRouter.use(authMiddleware, rbacMiddleware("ADMIN"));
adminRouter.get("/users", getUsersController);
adminRouter.patch("/users/:userId/approval", setUserApprovalController);
adminRouter.get("/reports/export", exportReportsController);
