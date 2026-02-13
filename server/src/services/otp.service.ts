import crypto from "crypto";
import { prisma } from "../config/prisma";
import { compareValue, hashValue } from "../utils/hash";

const OTP_TTL_MINUTES = 10;

export const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const createOtpForUser = async (userId: string, otp: string) => {
  const codeHash = await hashValue(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: { userId, codeHash, expiresAt }
  });
};

export const verifyOtpForUser = async (userId: string, otp: string) => {
  const latestOtp = await prisma.otpCode.findFirst({
    where: { userId, usedAt: null },
    orderBy: { createdAt: "desc" }
  });

  if (!latestOtp) return false;
  if (latestOtp.expiresAt.getTime() < Date.now()) return false;

  const isMatch = await compareValue(otp, latestOtp.codeHash);
  if (!isMatch) return false;

  await prisma.otpCode.update({
    where: { id: latestOtp.id },
    data: { usedAt: new Date() }
  });

  return true;
};

export const tokenFromRandom = () => crypto.randomBytes(24).toString("hex");
