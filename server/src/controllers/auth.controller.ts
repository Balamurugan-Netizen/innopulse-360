import { Request, Response } from "express";
import { loginUser, refreshSession, registerUser, verifyRegistrationOtp } from "../services/auth.service";
import { setRefreshCookie } from "../utils/cookies";

export const registerController = async (req: Request, res: Response) => {
  const result = await registerUser(req.body, req.ip);
  return res.status(201).json(result);
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await verifyRegistrationOtp(email, otp, req.ip);
  return res.status(200).json(result);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password, req.ip);
  setRefreshCookie(res, result.refreshToken);
  return res.status(200).json({
    accessToken: result.accessToken,
    user: result.user
  });
};

export const refreshController = async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies.refreshToken as string | undefined;
  const tokenFromBody = req.body.refreshToken as string | undefined;
  const refreshToken = tokenFromCookie || tokenFromBody;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  const session = await refreshSession(refreshToken);
  setRefreshCookie(res, session.refreshToken);
  return res.status(200).json({ accessToken: session.accessToken });
};

export const logoutController = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out" });
};
