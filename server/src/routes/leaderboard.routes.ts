import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma/client.js";
import { cacheService } from "../services/cache.service.js";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { levelForPoints } from "../services/progress.service.js";

const router = Router();

/**
 * GET /leaderboard?institutionId=&limit=
 * Public eco-points leaderboard. Only exposes display names and avatars —
 * never emails.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const institutionId =
      typeof req.query.institutionId === "string" && req.query.institutionId
        ? req.query.institutionId
        : undefined;
    const parsedLimit = Number.parseInt(String(req.query.limit ?? "10"), 10);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 50)
      : 10;

    const cacheKey = `leaderboard:${institutionId ?? "global"}:${limit}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return sendResponse({ res, success: true, data: cached });
    }

    const students = await prisma.student.findMany({
      where: institutionId ? { institutionId } : {},
      orderBy: [{ ecoPoints: "desc" }, { createdAt: "asc" }],
      take: limit,
      select: {
        id: true,
        ecoPoints: true,
        user: { select: { name: true, avatar: true } },
        institution: { select: { id: true, name: true } },
      },
    });

    const leaderboard = students.map((student, index) => ({
      rank: index + 1,
      studentId: student.id,
      name: student.user.name ?? "Eco Explorer",
      avatar: student.user.avatar,
      ecoPoints: student.ecoPoints,
      level: levelForPoints(student.ecoPoints),
      institution: student.institution,
    }));

    const payload = { leaderboard, scope: institutionId ? "institution" : "global" };
    await cacheService.set(cacheKey, payload, 30);

    return sendResponse({ res, success: true, data: payload });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return sendResponse({
      res,
      success: false,
      message: "Failed to load leaderboard",
      error: { message: "Failed to load leaderboard" },
      statusCode: 500,
    });
  }
});

export default router;
