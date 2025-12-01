import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getKycForCurrentUser, stringifyKyc } from "@/lib/kyc";
import { generateText } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

type GenerateBody = {
  moduleId: string;
  input: any;
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, input } = (await req.json()) as GenerateBody;

  const kyc = await getKycForCurrentUser();
  if (!kyc) {
    return NextResponse.json(
      { error: "No KYC found. Please complete your business profile first." },
      { status: 400 }
    );
  }

  const kycString = stringifyKyc(kyc);
  let prompt = "";

  switch (moduleId) {
    case "reply-assistant": {
      const { customerMessage, scenario } = input;
      prompt = `
You are an AI assistant for this business:

${kycString}

Customer message:
"${customerMessage}"

Scenario: ${scenario ?? "general"}

Rules:
- Follow brand tone and language from the profile.
- Follow pricing and policy details strictly.
- Be clear, polite, and aligned with the brand.

Write ONLY the reply text, nothing else.
`;
      break;
    }

    case "website-content": {
      prompt = `
Using the business profile below, generate website homepage copy.

Business profile:
${kycString}

Write:
1. Hero headline
2. Subheadline
3. Short About section
4. Why choose us (bullet points)
5. Brief product/service overview
`;
      break;
    }

    default:
      return NextResponse.json({ error: "Unknown moduleId" }, { status: 400 });
  }

  const text = await generateText(prompt);
  return NextResponse.json({ result: text });
}
