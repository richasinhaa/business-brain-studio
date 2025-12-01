// src/app/api/kyc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // raw PrismaClient

// If you also use a db wrapper somewhere else, that's fine.
// Here we talk directly to `prisma` for clarity.

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    // Not logged in → no KYC
    if (!sessionUser?.email) {
      return NextResponse.json(null);
    }

    // Make sure there is a DB user row for this email
    const dbUser = await prisma.user.upsert({
      where: { email: sessionUser.email },
      update: {
        name: sessionUser.name ?? undefined,
      },
      create: {
        email: sessionUser.email,
        name: sessionUser.name ?? null,
      },
    });

    const kyc = await prisma.businessKyc.findFirst({
      where: { userId: dbUser.id },
    });

    return NextResponse.json(kyc?.data ?? null);
  } catch (err) {
    console.error("KYC GET error:", err);
    return NextResponse.json(
      { error: "Failed to load KYC. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1) Ensure User exists in DB (email is our ground truth)
    const dbUser = await prisma.user.upsert({
      where: { email: sessionUser.email },
      update: {
        name: sessionUser.name ?? undefined,
      },
      create: {
        email: sessionUser.email,
        name: sessionUser.name ?? null,
      },
    });

    const userId = dbUser.id;

    // 2) Read submitted KYC data from body
    const body = await req.json(); // same shape you're using in KycForm

    // 3) Check if a BusinessKyc already exists for this user
    const existing = await prisma.businessKyc.findFirst({
      where: { userId },
    });

    let saved;

    if (existing) {
      // Update existing KYC
      saved = await prisma.businessKyc.update({
        where: { id: existing.id },
        data: {
          data: body,
        },
      });
    } else {
      // Create new KYC
      saved = await prisma.businessKyc.create({
        data: {
          userId,
          data: body,
        },
      });
    }

    return NextResponse.json(saved.data ?? null);
  } catch (err: any) {
    console.error("KYC POST error:", err);
    return NextResponse.json(
      { error: "Failed to save KYC. Please try again." },
      { status: 500 }
    );
  }
}
