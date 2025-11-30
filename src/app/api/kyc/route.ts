import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kyc = await db.businessKyc.findFirst({
    where: { userId: user.id },
  });

  return NextResponse.json(kyc?.data ?? null);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const existing = await db.businessKyc.findFirst({
    where: { userId: user.id },
  });

  if (existing) {
    await db.businessKyc.update({
      where: { id: existing.id },
      data: { data: body },
    });
  } else {
    await db.businessKyc.create({
      data: {
        userId: user.id,
        data: body,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
