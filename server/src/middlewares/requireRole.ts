import type { NextFunction, Request, Response } from "express";
import { UserRole, type User } from "@prisma/client";

const deny = (res: Response, statusCode: number, message: string) =>
  res.status(statusCode).json({ success: false, message, error: { message } });

export const hasRole = (user: User | undefined, ...roles: UserRole[]) =>
  Boolean(user && (user.isAdmin || roles.includes(user.role)));

/** Educators are teachers and platform admins. */
export const isEducator = (user: User | undefined) =>
  hasRole(user, UserRole.TEACHER);

/**
 * Gate a route to the given roles. Admins always pass.
 * Must run after `validToken`.
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return deny(res, 401, "Unauthorized request");
    }

    if (!hasRole(req.user, ...roles)) {
      return deny(res, 403, "You do not have permission to perform this action");
    }

    return next();
  };

export const requireEducator = requireRole(UserRole.TEACHER);
