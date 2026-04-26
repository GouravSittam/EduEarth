import { prisma } from "../prisma/client.js";

export const articlesRepository = {
  findMany: prisma.article.findMany.bind(prisma.article),
  count: prisma.article.count.bind(prisma.article),
  findUnique: prisma.article.findUnique.bind(prisma.article),
  create: prisma.article.create.bind(prisma.article),
  update: prisma.article.update.bind(prisma.article),
  delete: prisma.article.delete.bind(prisma.article),
  upsert: prisma.article.upsert.bind(prisma.article),
  groupBy: prisma.article.groupBy.bind(prisma.article),
};
