import { prisma } from "../config/prisma";

export const logActivity = async (params: {
  userId?: string;
  action: string;
  ipAddress?: string;
  metadata?: unknown;
}) => {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      ipAddress: params.ipAddress,
      metadata: params.metadata as object
    }
  });
};
