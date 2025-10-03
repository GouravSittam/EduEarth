import prisma from "../prisma/client.js";
import {
  accessSecret,
  accessTokenCookieOptions,
  accessTokenExpiry,
  clientBaseUrl,
  getExpiryDate,
  refreshSecret,
  refreshTokenCookieOptions,
  refreshTokenExpiry,
  testUser,
} from "../utils/auth.js";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { getErrorMessage } from "../utils/utils.js";
import { Request, Response } from "express";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { oAuth2Client } from "../utils/googleClient.js";
import { User } from "@prisma/client";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import axios from "axios";

export const generateTokens = async (
  req: Request,
  res: Response,
  user: User
) => {
  const clientRefreshToken =
    req.cookies?.refreshToken || req.headers["refresh-token"];

  if (clientRefreshToken) {
    jwt.verify(clientRefreshToken, refreshSecret);

    await prisma.refreshToken.update({
      where: {
        token: clientRefreshToken,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email } as AccessTokenPayload,
    accessSecret,
    { expiresIn: accessTokenExpiry as StringValue }
  );

  const refreshToken = jwt.sign(
    { id: user.id, createdAt: new Date() } as RefreshTokenPayload,
    refreshSecret,
    {
      expiresIn: refreshTokenExpiry as StringValue,
    }
  );

  const clientInfo = {
    userAgent: req?.headers?.["user-agent"] ?? "N/A",
    host: req?.headers?.["host"] ?? "N/A",
    ip:
      (req?.headers?.["x-forwarded-for"] || req?.socket?.remoteAddress) ??
      "N/A",
  };

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getExpiryDate(refreshTokenExpiry),
      clientInfo,
    },
  });

  res
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return { accessToken, refreshToken };
};

export const getUser = async (req: Request, res: Response) => {
  try {
    return sendResponse({
      res,
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to get user information"),
      },
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return sendResponse({
      res,
      success: true,
      data: { user },
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to update user information"),
      },
    });
  }
};

export const refreshUserToken = async (req: Request, res: Response) => {
  const clientRefreshToken =
    req.cookies?.refreshToken || req.headers["refresh-token"];

  if (!clientRefreshToken) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      error: {
        message: "Unauthorized request",
      },
    });
  }

  jwt.verify(clientRefreshToken, refreshSecret);

  try {
    const { id: userId } = jwt.verify(
      clientRefreshToken,
      refreshSecret
    ) as RefreshTokenPayload;

    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId, token: clientRefreshToken },
      include: { user: true },
    });

    if (!dbRefreshToken?.user) {
      throw new Error("Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(
      req,
      res,
      dbRefreshToken.user
    );

    return sendResponse({
      res,
      success: true,
      data: { accessToken, refreshToken },
      message: "Token refreshed successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(
          error,
          getErrorMessage(error, "Failed to refresh token")
        ),
        details: error,
      },
      statusCode: 403,
    });
  }
};

export const getNewAccessToken = async (req: Request, res: Response) => {
  const clientRefreshToken =
    req.cookies?.refreshToken || req.headers["refresh-token"];

  if (!clientRefreshToken) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      error: {
        message: "Unauthorized request",
      },
    });
  }

  jwt.verify(clientRefreshToken, refreshSecret);

  try {
    const { id: userId } = jwt.verify(
      clientRefreshToken,
      refreshSecret
    ) as RefreshTokenPayload;

    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId, token: clientRefreshToken },
      include: { user: true },
    });

    if (!dbRefreshToken?.user) {
      throw new Error("Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(
      req,
      res,
      dbRefreshToken.user
    );

    return sendResponse({
      res,
      success: true,
      data: {
        accessToken,
        accessTokenExpiresAt: new Date(Date.now() + ms(accessTokenExpiry)),
        refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + ms(refreshTokenExpiry)),
      },
      message: "Token refreshed successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(
          error,
          getErrorMessage(error, "Failed to refresh token")
        ),
        details: error,
      },
      statusCode: 403,
    });
  }
};

export const emailLogin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }
    if (!user) throw new Error("User creation failed");

    await prisma.otp.deleteMany({ where: { userId: user.id } });

    let otp;
    if (testUser && testUser.email === email) {
      otp = testUser.otp;
    } else {
      otp = crypto.randomInt(100000, 1000000).toString();
    }
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await prisma.otp.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    if (!(testUser && testUser.email === email)) {
      await sendMail({
        to: email,
        subject: "Your OTP Code",
        content: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      });
    }

    return sendResponse({
      res,
      success: true,
      message: `OTP sent to ${email}`,
      data: { otpExpiresAt: expiresAt },
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to login with email"),
      },
    });
  }
};

export const emailVerify = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { otp: true },
    });

    if (!user) throw new Error("User not found");
    if (!user.otp) throw new Error("OTP not found");

    const validOtp = user.otp.otp === otp && user.otp.expiresAt > new Date();

    if (validOtp) {
      await prisma.otp.delete({ where: { id: user.otp.id } });

      await generateTokens(req, res, user);

      return sendResponse({
        res,
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      throw new Error("OTP did not match or expired !!");
    }
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to verify email !!"),
      },
    });
  }
};

export const googleAuthUrl = (_req: Request, res: Response) => {
  try {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });
    return sendResponse({
      res,
      success: true,
      data: { url: authorizeUrl },
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to get Google Auth URL"),
      },
    });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code;
    if (!code || typeof code !== "string") {
      return sendResponse({
        res,
        success: false,
        error: {
          message: "Authorization code is required",
        },
        statusCode: 400,
      });
    }

    const { tokens } = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(tokens);

    const { id_token, access_token } = tokens;

    const { data: GoogleUserInfo } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    const { email, name, picture } = GoogleUserInfo as {
      email: string;
      name: string;
      picture: string;
    };

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar: picture,
        },
      });
    }

    await generateTokens(req, res, user);

    return res.redirect(clientBaseUrl);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return res.redirect(
      encodeURI(
        `${clientBaseUrl}/login?error=Failed to authenticate with Google`
      )
    );
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const clientRefreshToken =
      req.cookies?.refreshToken || req.headers["refresh-token"];

    await prisma.refreshToken.delete({
      where: {
        token: clientRefreshToken,
      },
    });

    res
      .clearCookie("accessToken", accessTokenCookieOptions)
      .clearCookie("refreshToken", refreshTokenCookieOptions);

    return sendResponse({
      res,
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to logout"),
      },
    });
  }
};
