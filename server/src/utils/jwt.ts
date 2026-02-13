import { RoleType } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types/express";

const accessTokenOptions: jwt.SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"]
};

const refreshTokenOptions: jwt.SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"]
};

export const signAccessToken = (userId: string, role: RoleType) =>
  jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, accessTokenOptions);

export const signRefreshToken = (userId: string, role: RoleType) =>
  jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, refreshTokenOptions);

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
export const verifyRefreshToken = (token: string) => jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
