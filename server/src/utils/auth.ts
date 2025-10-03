import { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";

// --- Secrets and Keys ---
export const refreshSecret: jwt.Secret = process.env.REFRESH_TOKEN_SECRET ?? "";
export const accessSecret: jwt.Secret = process.env.ACCESS_TOKEN_SECRET ?? "";
export const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

// --- Expiry Durations ---
export const accessTokenExpiry = "15m";
export const refreshTokenExpiry = "7d";

// --- Environment ---
const isProduction = process.env.NODE_ENV === "production";

// --- Cookie Configurations ---
export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: ms(accessTokenExpiry as StringValue),
};

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: ms(refreshTokenExpiry as StringValue),
};

// --- URLs and Paths ---
export const serverBaseUrl = process.env.SERVER_BASE_URL ?? "";
export const clientBaseUrl = process.env.CLIENT_BASE_URL ?? "";
export const googleRedirectPath = process.env.GOOGLE_REDIRECT_PATH ?? "";
export const clientCallbackPath = process.env.CLIENT_CALLBACK_PATH ?? "";
export const googleRedirectUrl = `${serverBaseUrl}${googleRedirectPath}`;
export const clientCallbackUrl = `${clientBaseUrl}${clientCallbackPath}`;

// --- Test User Configuration ---
export const testMail = process.env.TEST_MAIL ?? null;
export const testOtp = process.env.TEST_OTP ?? null;
export const testUser =
  testMail && testOtp ? { email: testMail, otp: testOtp } : null;

export function getExpiryDate(timeString: string) {
  const milliseconds = ms(timeString as StringValue);
  return new Date(Date.now() + milliseconds);
}
