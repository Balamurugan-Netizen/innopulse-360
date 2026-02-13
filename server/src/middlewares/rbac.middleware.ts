import { RoleType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export const rbacMiddleware = (...allowedRoles: RoleType[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
};
