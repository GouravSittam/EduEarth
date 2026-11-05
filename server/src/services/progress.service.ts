import type { Prisma } from "@prisma/client";

const DAY_MS = 24 * 60 * 60 * 1000;

const utcDayIndex = (date: Date) =>
  Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      DAY_MS,
  );

/**
 * Level curve: each level needs progressively more eco-points.
 * L1: 0-49, L2: 50-199, L3: 200-449, L4: 450-799, ...
 */
export const levelForPoints = (points: number) =>
  Math.floor(Math.sqrt(Math.max(0, points) / 50)) + 1;

/** Points needed to reach a given level (inverse of levelForPoints). */
export const pointsForLevel = (level: number) =>
  50 * Math.max(0, level - 1) ** 2;

/** Streak after an activity happening `now`, given the previous activity date. */
export const nextStreak = (
  lastActivity: Date | null,
  currentStreak: number,
  now = new Date(),
) => {
  if (!lastActivity) return 1;

  const gap = utcDayIndex(now) - utcDayIndex(lastActivity);
  if (gap <= 0) return Math.max(1, currentStreak);
  if (gap === 1) return currentStreak + 1;
  return 1;
};

/**
 * The streak to display: a stored streak is only "alive" if the student was
 * active today or yesterday.
 */
export const effectiveStreak = (
  lastActivity: Date | null,
  storedStreak: number,
  now = new Date(),
) => {
  if (!lastActivity) return 0;
  return utcDayIndex(now) - utcDayIndex(lastActivity) <= 1 ? storedStreak : 0;
};

/**
 * Record a learning activity for a student inside an existing transaction:
 * awards eco-points, recomputes level and advances the daily streak.
 */
export const recordActivity = async (
  tx: Prisma.TransactionClient,
  studentId: string,
  pointsAwarded: number,
) => {
  const student = await tx.student.findUnique({
    where: { id: studentId },
    select: { ecoPoints: true, streak: true, lastActivityDate: true },
  });

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  const points = Math.max(0, Math.floor(pointsAwarded));
  const now = new Date();
  const totalPoints = student.ecoPoints + points;
  const previousLevel = levelForPoints(student.ecoPoints);
  const level = levelForPoints(totalPoints);

  const updated = await tx.student.update({
    where: { id: studentId },
    data: {
      ecoPoints: { increment: points },
      level,
      streak: nextStreak(student.lastActivityDate, student.streak, now),
      lastActivityDate: now,
    },
    select: { ecoPoints: true, level: true, streak: true },
  });

  return { ...updated, pointsAwarded: points, leveledUp: level > previousLevel };
};
