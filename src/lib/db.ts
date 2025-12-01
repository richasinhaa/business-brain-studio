// src/lib/db.ts
import { prisma } from "./prisma";

// Derive delegate types from the actual Prisma client instance
type BusinessKycDelegate = typeof prisma.businessKyc;

// Thin wrapper around Prisma so existing code using `db.businessKyc` keeps working.
export const db = {
  businessKyc: {
    findFirst: (
      args: Parameters<BusinessKycDelegate["findFirst"]>[0]
    ) => {
      return prisma.businessKyc.findFirst(args);
    },
    create: (
      args: Parameters<BusinessKycDelegate["create"]>[0]
    ) => {
      return prisma.businessKyc.create(args);
    },
    update: (
      args: Parameters<BusinessKycDelegate["update"]>[0]
    ) => {
      return prisma.businessKyc.update(args);
    },
    upsert: (
      args: Parameters<BusinessKycDelegate["upsert"]>[0]
    ) => {
      return prisma.businessKyc.upsert(args);
    },
  },
};
