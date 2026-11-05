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

const AUTH_CACHE_TTL_MS = 60_000;
const AUTH_CACHE_MAX_ENTRIES = 5_000;

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

type CachedAuth = { expiresAt: number; user: User; supabaseUser: SupabaseUser };

/**
 * Short-lived cache of verified tokens so every request does not round-trip
 * to Supabase. Entries are pruned periodically and the map is size-bounded so
 * a stream of unique tokens can never grow memory without limit.
 */
const authCache = new Map<string, CachedAuth>();

const pruneAuthCache = () => {
  const now = Date.now();
  for (const [token, entry] of authCache) {
    if (entry.expiresAt <= now) {
      authCache.delete(token);
    }
  }
};

setInterval(pruneAuthCache, AUTH_CACHE_TTL_MS).unref();

const cacheAuth = (token: string, entry: CachedAuth) => {
  if (authCache.size >= AUTH_CACHE_MAX_ENTRIES) {
    pruneAuthCache();
  }

  // Map preserves insertion order, so the first key is the oldest entry.
  while (authCache.size >= AUTH_CACHE_MAX_ENTRIES) {
    const oldestKey = authCache.keys().next().value;
    if (oldestKey === undefined) break;
    authCache.delete(oldestKey);
  }

  authCache.set(token, entry);
};

/** Drop cached auth for a user after their profile/role changes. */
export const invalidateAuthCacheForUser = (userId: string) => {
  for (const [token, entry] of authCache) {
    if (entry.user.id === userId) {
      authCache.delete(token);
    }
  }
};

const syncPrismaUser = async (supabaseUser: SupabaseUser) => {
  if (!supabaseUser.email) {
    throw new Error("Supabase user email is missing");
  }

  const fullName =
    getMetadataValue(supabaseUser.user_metadata, "full_name") ??
    getMetadataValue(supabaseUser.user_metadata, "name");
  const avatarUrl =
    getMetadataValue(supabaseUser.user_metadata, "avatar_url") ??
    getMetadataValue(supabaseUser.user_metadata, "picture");
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

/**
 * Resolve the request's bearer token into a Prisma user.
 * Returns null when no token is present; throws when a token is invalid.
 */
const authenticate = async (req: Request): Promise<CachedAuth | null> => {
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return null;
  }

  const cachedAuth = authCache.get(accessToken);
  if (cachedAuth && cachedAuth.expiresAt > Date.now()) {
    return cachedAuth;
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
  const entry: CachedAuth = {
    expiresAt: Date.now() + AUTH_CACHE_TTL_MS,
    user,
    supabaseUser,
  };
  cacheAuth(accessToken, entry);

  return entry;
};

const sendUnauthorized = (res: Response, message: string) =>
  res.status(401).json({
    success: false,
    message,
    error: { message },
  });

export default async function validToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const auth = await authenticate(req);

    if (!auth) {
      return sendUnauthorized(res, "Unauthorized request");
    }

    req.user = auth.user;
    req.supabaseUser = auth.supabaseUser;
    next();
  } catch (error) {
    return sendUnauthorized(res, getErrorMessage(error, "Unauthorized Access"));
  }
}

/**
 * Like validToken, but lets anonymous requests through. Useful for public
 * endpoints that reveal extra data (e.g. answer keys) to educators.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = await authenticate(req);
    if (auth) {
      req.user = auth.user;
      req.supabaseUser = auth.supabaseUser;
    }
  } catch {
    // An invalid token on a public route is treated as anonymous.
  }

  next();
}
