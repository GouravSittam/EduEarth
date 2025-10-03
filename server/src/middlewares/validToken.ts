import prisma from "../prisma/client.js";
import { accessSecret } from "../utils/auth.js";
import { getErrorMessage } from "../utils/utils.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default async function validToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    console.log(
      "🔐 Auth middleware - checking token for:",
      req.method,
      req.path
    );

    const accessToken = req.cookies?.accessToken || req.headers["access-token"];

    if (!accessToken) {
      console.error("❌ No access token found in cookies or headers");
      throw "Unauthorized request";
    }

    const { id: userId } = jwt.verify(
      accessToken,
      accessSecret
    ) as AccessTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ User not found for ID:", userId);
      throw "Invalid Access Token";
    }

    console.log("✅ Auth successful for user:", user.email, "ID:", user.id);
    req.user = user;

    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    return res
      .status(401)
      .json({ error: getErrorMessage(err, "Unauthorized Access") });
  }
}
