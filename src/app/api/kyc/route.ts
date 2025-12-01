// src/app/api/kyc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { BusinessKyc } from "@/types/kyc";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Load current user's KYC
export async function GET() {
  const sessionUser = (await getCurrentUser()) as SessionUser | null;

  // We rely on email as the stable identifier
  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the DB user by email
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });

  if (!dbUser) {
    // No DB user yet → no KYC either
    return NextResponse.json(null);
  }

  const record = await db.businessKyc.findFirst({
    where: { userId: dbUser.id },
  });

  const data = record?.data ?? null;
  return NextResponse.json(data);
}

// Save / update current user's KYC
export async function POST(req: NextRequest) {
  const sessionUser = (await getCurrentUser()) as SessionUser | null;

  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔑 Ensure a User row exists for this email (this removes the FK issue)
  const dbUser = await prisma.user.upsert({
    where: { email: sessionUser.email },
    update: {
      // keep these in sync but don't force them
      name: sessionUser.name ?? undefined,
      image: sessionUser.image ?? undefined,
    },
    create: {
      email: sessionUser.email,
      name: sessionUser.name ?? null,
      image: sessionUser.image ?? null,
    },
  });

  const body = (await req.json()) as BusinessKyc;

  // Does this user already have a KYC row?
  const existing = await db.businessKyc.findFirst({
    where: { userId: dbUser.id },
  });

  if (!existing) {
    // Create a new KYC record
    const created = await db.businessKyc.create({
      data: {
        userId: dbUser.id,
        // store full KYC object as JSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: body as any,
      },
    });
    return NextResponse.json(created.data);
  }

  // Update existing record
  const updated = await db.businessKyc.update({
    where: { id: existing.id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: body as any,
    },
  });

  return NextResponse.json(updated.data);
}
