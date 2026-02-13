import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { logActivity } from "../services/activity.service";

export const getUsersController = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    include: { role: true },
    orderBy: { createdAt: "desc" }
  });
  return res.status(200).json(users);
};

export const setUserApprovalController = async (req: Request, res: Response) => {
  const userId = String(req.params.userId);
  const { approved } = req.body as { approved: boolean };

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isApproved: approved }
  });

  await logActivity({
    userId: req.user?.userId,
    action: approved ? "USER_APPROVED" : "USER_REJECTED",
    ipAddress: req.ip,
    metadata: { targetUserId: userId }
  });

  return res.status(200).json({ id: user.id, approved: user.isApproved });
};

export const exportReportsController = async (req: Request, res: Response) => {
  const format = typeof req.query.format === "string" ? req.query.format.toLowerCase() : "csv";
  const rows = await prisma.performanceIndex.findMany({
    where: { deletedAt: null },
    orderBy: { calculatedAt: "desc" },
    take: 500
  });

  if (format === "pdf") {
    return res.status(200).json({
      message: "PDF export endpoint placeholder. Integrate a renderer like PDFKit for production template output."
    });
  }

  const header =
    "calculatedAt,ipi,tiss,eppi,contribution,milestone,mentorImprovement,punctuality,vivaScore\n";
  const lines = rows
    .map(
      (r) =>
        `${r.calculatedAt.toISOString()},${r.ipi ?? ""},${r.tiss ?? ""},${r.eppi ?? ""},${r.contributionPercentage},${r.milestoneCompletion},${r.mentorImprovementScore},${r.punctualityPercentage},${r.vivaScore}`
    )
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=innopulse360-report.csv");
  return res.status(200).send(header + lines);
};
