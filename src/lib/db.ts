// src/lib/db.ts
import { prisma } from "./prisma";

export const db = {
  businessKyc: {
    findFirst: (args: Parameters<typeof prisma.businessKyc.findFirst>[0]) =>
      prisma.businessKyc.findFirst(args),

    create: (args: Parameters<typeof prisma.businessKyc.create>[0]) =>
      prisma.businessKyc.create(args),

    update: (args: Parameters<typeof prisma.businessKyc.update>[0]) =>
      prisma.businessKyc.update(args),
  },
};
