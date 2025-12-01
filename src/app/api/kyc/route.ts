// src/app/api/kyc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { BusinessKyc } from "@/types/kyc";

type UserWithId = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Load current user's KYC
export async function GET() {
  const user = (await getCurrentUser()) as UserWithId | null;
  const userId = user?.id ?? null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await db.businessKyc.findFirst({
    where: { userId },
  });

  const data = record?.data ?? null;
  return NextResponse.json(data);
}

// Save / update current user's KYC
export async function POST(req: NextRequest) {
  const user = (await getCurrentUser()) as UserWithId | null;
  const userId = user?.id ?? null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as BusinessKyc;

  // First, see if a KYC record already exists for this user
  const existing = await db.businessKyc.findFirst({
    where: { userId },
  });

  if (!existing) {
    // Create a new record
    const created = await db.businessKyc.create({
      data: {
        userId,
        // Prisma JSON field – we store the whole KYC object as JSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: body as any,
      },
    });
    return NextResponse.json(created.data);
  }

  // Update existing record by its primary key id
  const updated = await db.businessKyc.update({
    where: { id: existing.id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: body as any,
    },
  });

  return NextResponse.json(updated.data);
}
