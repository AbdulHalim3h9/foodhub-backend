import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      const decoded = jwt.verify(
        token,
        (process.env.JWT_ACCESS_SECRET as string) || "secret",
      ) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "User not found!",
        });
      }

      if (userData.status !== "ACTIVE") {
        return res.status(401).json({
          success: false,
          message: "User is not active!",
        });
      }

      if (roles.length && !roles.includes(userData.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource!",
        });
      }

      req.user = decoded as { id: string; email: string; role: string };
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
