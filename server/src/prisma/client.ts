import { PrismaClient } from "@prisma/client";
import { dbQueryDurationMs } from "../observability/metrics.js";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });

(prisma as any).$on("query", (event: { target?: string; duration: number }) => {
  dbQueryDurationMs.observe(
    {
      model: event.target ?? "raw",
      action: "query",
    },
    event.duration,
  );
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
