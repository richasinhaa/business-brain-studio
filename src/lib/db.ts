// src/lib/db.ts
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

// Thin wrapper around Prisma so existing code using `db.businessKyc` keeps working.
export const db = {
  businessKyc: {
    findFirst: (args: Prisma.BusinessKycFindFirstArgs) => {
      return prisma.businessKyc.findFirst(args);
    },
    create: (args: Prisma.BusinessKycCreateArgs) => {
      return prisma.businessKyc.create(args);
    },
    update: (args: Prisma.BusinessKycUpdateArgs) => {
      return prisma.businessKyc.update(args);
    },
  },
};
