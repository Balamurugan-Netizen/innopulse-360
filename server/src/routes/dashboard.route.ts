import { Router } from "express";
import { adminDashboardController, participantDashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rbacMiddleware } from "../middlewares/rbac.middleware";

export const dashboardRouter = Router();

dashboardRouter.get("/participant", authMiddleware, rbacMiddleware("PARTICIPANT"), participantDashboardController);
dashboardRouter.get("/admin", authMiddleware, rbacMiddleware("ADMIN"), adminDashboardController);
