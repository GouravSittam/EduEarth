import prisma from "../prisma/client.js";
import { getErrorMessage } from "../utils/utils.js";
import { Request, Response, NextFunction } from "express";
import { UserRole, type User } from "@prisma/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "../utils/supabase.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      supabaseUser?: SupabaseUser;
    }
  }
}

const parseRole = (value: unknown): UserRole => {
  if (typeof value !== "string") {
    return UserRole.USER;
  }

  const normalizedValue = value.toUpperCase();

  if (normalizedValue in UserRole) {
    return UserRole[normalizedValue as keyof typeof UserRole];
  }

  return UserRole.USER;
};

const getAccessToken = (req: Request) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length);
  }

  const accessTokenHeader = req.headers["access-token"];

  if (typeof accessTokenHeader === "string" && accessTokenHeader.length > 0) {
    return accessTokenHeader;
  }

  return null;
};

const getMetadataValue = (
  metadata: SupabaseUser["user_metadata"],
  key: string
) => {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const authCache = new Map<
  string,
  { expiresAt: number; user: User; supabaseUser: SupabaseUser }
>();

const syncPrismaUser = async (supabaseUser: SupabaseUser) => {
  if (!supabaseUser.email) {
    throw new Error("Supabase user email is missing");
  }

  const fullName =
    getMetadataValue(supabaseUser.user_metadata, "full_name") ??
    getMetadataValue(supabaseUser.user_metadata, "name");
  const avatarUrl = getMetadataValue(supabaseUser.user_metadata, "avatar_url");
  const role = parseRole(supabaseUser.user_metadata?.role);

  const existingUser = await prisma.user.findUnique({
    where: { email: supabaseUser.email },
  });

  if (!existingUser) {
    return prisma.user.create({
      data: {
        email: supabaseUser.email,
        name: fullName,
        avatar: avatarUrl,
        role,
      },
    });
  }

  const updates: Partial<User> = {};

  if (!existingUser.name && fullName) {
    updates.name = fullName;
  }

  if (!existingUser.avatar && avatarUrl) {
    updates.avatar = avatarUrl;
  }

  if (existingUser.role === UserRole.USER && role !== UserRole.USER) {
    updates.role = role;
  }

  if (Object.keys(updates).length === 0) {
    return existingUser;
  }

  return prisma.user.update({
    where: { id: existingUser.id },
    data: updates,
  });
};

export default async function validToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      throw new Error("Unauthorized request");
    }

    const cachedAuth = authCache.get(accessToken);
    if (cachedAuth && cachedAuth.expiresAt > Date.now()) {
      req.user = cachedAuth.user;
      req.supabaseUser = cachedAuth.supabaseUser;
      next();
      return;
    }

    const supabase = getSupabaseServerClient();
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !supabaseUser) {
      throw error ?? new Error("Invalid access token");
    }

    const user = await syncPrismaUser(supabaseUser);

    req.user = user;
    req.supabaseUser = supabaseUser;
    authCache.set(accessToken, {
      expiresAt: Date.now() + 60_000,
      user,
      supabaseUser,
    });

    next();
  } catch (error) {
    return res.status(401).json({
      error: getErrorMessage(error, "Unauthorized Access"),
    });
  }
}
