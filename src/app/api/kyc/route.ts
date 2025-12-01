// src/app/api/kyc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { BusinessKyc } from "@/types/kyc";

// Load current user's KYC
export async function GET() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await db.businessKyc.findFirst({
    where: { userId: user.id },
  });

  // We just return whatever is stored – KycForm knows the shape
  const data = record?.data ?? null;
  return NextResponse.json(data);
}

// Save / update current user's KYC
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // KYC payload from client
  const body = (await req.json()) as BusinessKyc;

  const record = await db.businessKyc.upsert({
    where: { userId: user.id },
    update: { data: body },
    create: { userId: user.id, data: body },
  });

  return NextResponse.json(record.data);
}
