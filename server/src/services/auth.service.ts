import { RoleType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/api-error";
import { compareValue, hashValue } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { sendOtpEmail } from "../utils/mailer";
import { createOtpForUser, generateOtp, verifyOtpForUser } from "./otp.service";
import { logActivity } from "./activity.service";

type RegisterInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: RoleType;
  state: string;
  institution: string;
  domainOfInterest: string;
  teamName?: string;
  governmentId?: string;
};

export const registerUser = async (payload: RegisterInput, ipAddress?: string) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const role = await prisma.role.findUnique({ where: { type: payload.role } });
  if (!role) {
    throw new ApiError(400, "Invalid role");
  }

  const passwordHash = await hashValue(payload.password);

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      passwordHash,
      roleId: role.id,
      state: payload.state,
      institution: payload.institution,
      domainOfInterest: payload.domainOfInterest,
      teamName: payload.teamName,
      governmentId: payload.governmentId,
      registrations: { create: { status: "PENDING" } }
    },
    include: { role: true }
  });

  const otp = generateOtp();
  await createOtpForUser(user.id, otp);
  await sendOtpEmail(user.email, otp);

  await logActivity({
    userId: user.id,
    action: "REGISTERED",
    ipAddress,
    metadata: { role: user.role.type }
  });

  return { id: user.id, email: user.email, role: user.role.type, isVerified: user.isVerified };
};

export const verifyRegistrationOtp = async (email: string, otp: string, ipAddress?: string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await verifyOtpForUser(user.id, otp);
  if (!isValid) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true }
  });

  await logActivity({
    userId: user.id,
    action: "EMAIL_VERIFIED",
    ipAddress
  });

  return { message: "Account verified successfully" };
};

const MAX_FAILED_ATTEMPTS = 6;
const LOCK_MINUTES = 15;

export const loginUser = async (email: string, password: string, ipAddress?: string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user) throw new ApiError(401, "Invalid credentials");

  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new ApiError(423, "Account locked due to failed attempts");
  }

  const isPasswordValid = await compareValue(password, user.passwordHash);
  if (!isPasswordValid) {
    const failed = user.failedLoginAttempts + 1;
    const lockUntil = failed >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: failed, lockUntil }
    });

    await logActivity({
      userId: user.id,
      action: "LOGIN_FAILED",
      ipAddress
    });

    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) throw new ApiError(403, "Verify email OTP first");
  if (!user.isApproved && user.role.type !== "ADMIN") {
    throw new ApiError(403, "Account pending admin approval");
  }

  const accessToken = signAccessToken(user.id, user.role.type);
  const refreshToken = signRefreshToken(user.id, user.role.type);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null,
      lastLoginAt: new Date()
    }
  });

  await logActivity({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    ipAddress
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.type
    }
  };
};

export const refreshSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { role: true } });

  if (!user || user.deletedAt) throw new ApiError(401, "Invalid refresh token");

  const newAccessToken = signAccessToken(user.id, user.role.type);
  const newRefreshToken = signRefreshToken(user.id, user.role.type);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};
