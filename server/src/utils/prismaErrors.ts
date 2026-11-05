import { Prisma } from "@prisma/client";

/** True when Prisma rejected a write because of a unique constraint. */
export const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

/** True when Prisma could not find the record targeted by an update/delete. */
export const isRecordNotFound = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

/** True when a write violates a foreign key (e.g. deleting a referenced row). */
export const isForeignKeyViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
