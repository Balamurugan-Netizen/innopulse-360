import { Router } from "express";
import { authRouter } from "./auth.route";
import { dashboardRouter } from "./dashboard.route";
import { adminRouter } from "./admin.route";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "InnoPulse 360 API" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/admin", adminRouter);
