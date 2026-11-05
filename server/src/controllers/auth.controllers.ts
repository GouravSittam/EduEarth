import prisma from "../prisma/client.js";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { getErrorMessage } from "../utils/utils.js";
import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";
import z from "zod";
import { invalidateAuthCacheForUser } from "../middlewares/validToken.js";
import { isUniqueViolation } from "../utils/prismaErrors.js";
import {
  effectiveStreak,
  levelForPoints,
  pointsForLevel,
} from "../services/progress.service.js";

/** Roles a user may pick for themselves (once, while still a plain USER). */
const SELF_ASSIGNABLE_ROLES: UserRole[] = [
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.PARENT,
];

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  avatar: z.url().max(2048).nullable().optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{6,20}$/, "Phone number is invalid")
    .nullable()
    .optional(),
  dateOfBirth: z.coerce.date().nullable().optional(),
  role: z.string().optional(),
});

const ACTIVITY_WINDOW_DAYS = 14;

const toIsoDay = (date: Date) => date.toISOString().slice(0, 10);

/** Days (YYYY-MM-DD, UTC) in the recent window on which the student learned. */
const getRecentActivityDays = async (studentId: string) => {
  const since = new Date(Date.now() - ACTIVITY_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [lessons, quizzes] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { studentId, completedAt: { gte: since } },
      select: { completedAt: true },
    }),
    prisma.quizAttempt.findMany({
      where: { studentId, completedAt: { gte: since } },
      select: { completedAt: true },
    }),
  ]);

  return [
    ...new Set(
      [...lessons, ...quizzes].map((entry) => toIsoDay(entry.completedAt)),
    ),
  ].sort();
};

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendResponse({
        res,
        success: false,
        error: {
          message: "Unauthorized request",
        },
        statusCode: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          select: {
            id: true,
            ecoPoints: true,
            level: true,
            streak: true,
            lastActivityDate: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                badges: true,
                challengeParticipations: true,
                classes: true,
                completedLessons: true,
                quizAttempts: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                classes: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return sendResponse({
        res,
        success: false,
        error: {
          message: "User not found",
        },
        statusCode: 404,
      });
    }

    if (!user.student) {
      return sendResponse({ res, success: true, data: { user } });
    }

    const { student } = user;
    const [higherRanked, activityDays] = await Promise.all([
      prisma.student.count({ where: { ecoPoints: { gt: student.ecoPoints } } }),
      getRecentActivityDays(student.id),
    ]);

    const level = levelForPoints(student.ecoPoints);

    return sendResponse({
      res,
      success: true,
      data: {
        user: {
          ...user,
          student: {
            ...student,
            level,
            streak: effectiveStreak(student.lastActivityDate, student.streak),
            rank: higherRanked + 1,
            activityDays,
            levelProgress: {
              currentLevelPoints: pointsForLevel(level),
              nextLevelPoints: pointsForLevel(level + 1),
            },
          },
        },
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to get user information"),
      },
      statusCode: 500,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendResponse({
        res,
        success: false,
        error: {
          message: "Unauthorized request",
        },
        statusCode: 401,
      });
    }

    const parsed = updateUserSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return sendResponse({
        res,
        success: false,
        error: {
          message: parsed.error.issues[0]?.message ?? "Invalid profile data",
          details: parsed.error.issues,
        },
        statusCode: 400,
      });
    }

    const input = parsed.data;
    const updates: Prisma.UserUpdateInput = {};

    if (input.name !== undefined) updates.name = input.name;
    if (input.avatar !== undefined) updates.avatar = input.avatar;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (input.dateOfBirth !== undefined) updates.dateOfBirth = input.dateOfBirth;

    if (input.role !== undefined) {
      const requestedRole = input.role.toUpperCase() as UserRole;

      if (!SELF_ASSIGNABLE_ROLES.includes(requestedRole) && !req.user.isAdmin) {
        return sendResponse({
          res,
          success: false,
          error: { message: "Invalid role" },
          statusCode: 400,
        });
      }

      // Regular users choose their role once; afterwards only admins change it.
      if (req.user.isAdmin || req.user.role === UserRole.USER) {
        if (requestedRole in UserRole) {
          updates.role = requestedRole;
        }
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updates,
    });

    invalidateAuthCacheForUser(req.user.id);

    return sendResponse({
      res,
      success: true,
      data: { user },
      message: "User updated successfully",
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return sendResponse({
        res,
        success: false,
        error: { message: "That phone number is already in use" },
        statusCode: 409,
      });
    }

    return sendResponse({
      res,
      success: false,
      error: {
        message: getErrorMessage(error, "Failed to update user information"),
      },
      statusCode: 500,
    });
  }
};
