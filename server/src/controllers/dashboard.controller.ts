import { Request, Response } from "express";
import { getAdminDashboard, getParticipantDashboard } from "../services/dashboard.service";

export const participantDashboardController = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await getParticipantDashboard(userId);
  return res.status(200).json(data);
};

export const adminDashboardController = async (req: Request, res: Response) => {
  const { state, domain } = req.query;
  const data = await getAdminDashboard({
    state: typeof state === "string" ? state : undefined,
    domain: typeof domain === "string" ? domain : undefined
  });

  return res.status(200).json(data);
};
