import { RoleType } from "@prisma/client";

export type JwtPayload = {
  userId: string;
  role: RoleType;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
