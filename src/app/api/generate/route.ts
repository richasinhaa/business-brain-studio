// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getKycForCurrentUser, stringifyKyc } from "@/lib/kyc";
import { generateText } from "@/lib/openai";

type ReplyAssistantInput = {
  customerMessage?: string;
  scenario?: string;
};

type GenerateBody = {
  moduleId: string;
  input: unknown;
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 }
    );
  }

  const { moduleId, input } = body as GenerateBody;

  if (!moduleId || typeof moduleId !== "string") {
    return NextResponse.json(
      { error: "moduleId is required" },
      { status: 400 }
    );
  }

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
      if (!input || typeof input !== "object") {
        return NextResponse.json(
          { error: "Invalid input for reply-assistant" },
          { status: 400 }
        );
      }

      const { customerMessage, scenario } = input as ReplyAssistantInput;

      if (!customerMessage || typeof customerMessage !== "string") {
        return NextResponse.json(
          { error: "customerMessage is required" },
          { status: 400 }
        );
      }

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
      return NextResponse.json(
        { error: "Unknown moduleId" },
        { status: 400 }
      );
  }

  const text = await generateText(prompt);
  return NextResponse.json({ result: text });
}
