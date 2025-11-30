#!/usr/bin/env bash
set -e

echo "🚀 Bootstrapping Business Brain Studio *in current project* ..."
echo "Working directory: $(pwd)"

# Core app folders
mkdir -p src/app
mkdir -p src/app/kyc
mkdir -p src/app/modules/reply-assistant
mkdir -p src/app/modules/website-content
mkdir -p src/app/modules/whatsapp-broadcast
mkdir -p src/app/modules/instagram-captions
mkdir -p src/app/modules/product-descriptions
mkdir -p src/app/modules/sales-scripts
mkdir -p src/app/modules/review-requests
mkdir -p src/app/modules/about-bio

# API routes
mkdir -p src/app/api/kyc
mkdir -p src/app/api/generate

# Components
mkdir -p src/components/layout
mkdir -p src/components/kyc
mkdir -p src/components/modules
mkdir -p src/components/ui

# Lib & types
mkdir -p src/lib/modules/prompts
mkdir -p src/lib/modules
mkdir -p src/lib
mkdir -p src/types

# Styles & public
mkdir -p src/styles
mkdir -p public

########################################
# globals.css
########################################
cat <<'EOF' > src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-950 text-slate-50;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}
EOF

########################################
# Root layout.tsx
########################################
cat <<'EOF' > src/app/layout.tsx
import React from "react";
import "@/styles/globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Business Brain Studio",
  description: "Enter your business once. Generate everything you need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
EOF

########################################
# Dashboard page.tsx
########################################
cat <<'EOF' > src/app/page.tsx
import { MODULES } from "@/lib/modules/registry";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Business Brain Studio</h1>
        <p className="text-sm text-slate-400 mt-1">
          Fill your business KYC once, then generate replies, content, and
          campaigns tailored to you.
        </p>
      </header>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
        <h2 className="text-sm font-medium mb-2">Get started</h2>
        <p className="text-xs text-slate-400 mb-3">
          1. Complete your Business KYC. 2. Pick a module. 3. Generate content
          in your brand voice.
        </p>
        <a
          href="/kyc"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded bg-emerald-500 text-black font-medium"
        >
          Complete Business KYC
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Modules</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => (
            <a
              key={m.id}
              href={m.route}
              className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 hover:border-emerald-500/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{m.icon}</span>
                <span className="text-sm font-medium">{m.name}</span>
              </div>
              <p className="text-xs text-slate-400">{m.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
EOF

########################################
# AppShell layout component
########################################
cat <<'EOF' > src/components/layout/AppShell.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules/registry";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Business Brain Studio</span>
          <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>AI for Small Businesses</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 p-3 hidden md:block">
          <div className="mb-3 text-[10px] uppercase tracking-wide text-slate-500">
            Navigation
          </div>
          <nav className="flex flex-col gap-1 mb-4">
            <Link
              href="/"
              className={`px-2 py-1.5 rounded text-xs ${
                pathname === "/"
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/kyc"
              className={`px-2 py-1.5 rounded text-xs ${
                pathname.startsWith("/kyc")
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              Business KYC
            </Link>
          </nav>

          <div className="mb-2 text-[10px] uppercase tracking-wide text-slate-500">
            Modules
          </div>
          <nav className="flex flex-col gap-1 text-xs">
            {MODULES.map((m) => (
              <Link
                key={m.id}
                href={m.route}
                className={`px-2 py-1.5 rounded flex items-center gap-2 ${
                  pathname.startsWith(m.route)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
EOF

########################################
# Types: KYC
########################################
cat <<'EOF' > src/types/kyc.ts
export type BrandTone =
  | "friendly"
  | "formal"
  | "luxury"
  | "playful"
  | "strict"
  | "empathetic";

export type LanguagePreference = "english" | "hindi" | "hinglish";

export interface BusinessKyc {
  id?: string;
  userId?: string;
  businessName: string;
  industry: string;
  shortDescription: string;
  targetAudience: string;
  location?: string;

  products: {
    name: string;
    description?: string;
  }[];

  priceRange?: {
    min?: number;
    max?: number;
  };

  bestSellers?: string[];

  brandTone: BrandTone;
  languagePreference: LanguagePreference;
  writingStyle: "short" | "medium" | "long" | "emoji-heavy" | "no-emojis";

  refundPolicy?: string;
  returnPolicy?: string;
  shippingRules?: string;
  deliveryTimelines?: string;
  paymentRules?: string;

  usp?: string;
  importantFestivals?: string[];
  competitors?: string[];

  createdAt?: string;
  updatedAt?: string;
}
EOF

########################################
# Types: modules
########################################
cat <<'EOF' > src/types/modules.ts
export type ModuleId =
  | "reply-assistant"
  | "website-content"
  | "whatsapp-broadcast"
  | "instagram-captions"
  | "product-descriptions"
  | "sales-scripts"
  | "review-requests"
  | "about-bio";

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  icon?: string;
  route: string;
}
EOF

########################################
# Module registry
########################################
cat <<'EOF' > src/lib/modules/registry.ts
import type { ModuleConfig } from "@/types/modules";

export const MODULES: ModuleConfig[] = [
  {
    id: "reply-assistant",
    name: "Customer Reply Assistant",
    description: "Generate perfect customer replies based on your business profile.",
    icon: "💬",
    route: "/modules/reply-assistant",
  },
  {
    id: "website-content",
    name: "Website Content Studio",
    description: "Homepage copy, about section, and more.",
    icon: "🖥️",
    route: "/modules/website-content",
  },
  {
    id: "whatsapp-broadcast",
    name: "WhatsApp Broadcast Generator",
    description: "Campaign messages for offers and launches.",
    icon: "📢",
    route: "/modules/whatsapp-broadcast",
  },
  {
    id: "instagram-captions",
    name: "Instagram Caption Studio",
    description: "Scroll-stopping captions tailored to your brand.",
    icon: "📸",
    route: "/modules/instagram-captions",
  },
  {
    id: "product-descriptions",
    name: "Product Description Maker",
    description: "SEO-friendly, convincing product descriptions.",
    icon: "🛒",
    route: "/modules/product-descriptions",
  },
  {
    id: "sales-scripts",
    name: "Sales Script Writer",
    description: "DM and call scripts that convert.",
    icon: "🔥",
    route: "/modules/sales-scripts",
  },
  {
    id: "review-requests",
    name: "Review Request Messages",
    description: "Polite, effective review request templates.",
    icon: "⭐",
    route: "/modules/review-requests",
  },
  {
    id: "about-bio",
    name: "About & Bio Writer",
    description: "Bios for WhatsApp, Instagram, and your site.",
    icon: "👤",
    route: "/modules/about-bio",
  },
];

export const getModuleById = (id: string) =>
  MODULES.find((m) => m.id === id);
EOF

########################################
# lib: db, auth, openai, kyc
########################################
cat <<'EOF' > src/lib/db.ts
// Placeholder DB helper.
// Replace with your actual Prisma / Supabase / ORM logic.

export const db = {
  businessKyc: {
    async findFirst(_opts: any) {
      return null;
    },
    async create(_opts: any) {
      return;
    },
    async update(_opts: any) {
      return;
    },
  },
};
EOF

cat <<'EOF' > src/lib/auth.ts
// Placeholder auth helper.
// Replace with your real getCurrentUser implementation.

export async function getCurrentUser() {
  // TODO: integrate with your auth (NextAuth, custom, etc.)
  return { id: "demo-user-id", email: "demo@example.com" };
}
EOF

cat <<'EOF' > src/lib/openai.ts
// Hook this to the OpenAI SDK when you're ready.

export async function generateText(prompt: string): Promise<string> {
  // For now just log the prompt and return placeholder text.
  console.log("DEBUG prompt to OpenAI:", prompt.slice(0, 200));
  return "This is a placeholder response. Connect OpenAI in src/lib/openai.ts.";
}
EOF

cat <<'EOF' > src/lib/kyc.ts
import { BusinessKyc } from "@/types/kyc";
import { db } from "./db";
import { getCurrentUser } from "./auth";

export async function getKycForCurrentUser(): Promise<BusinessKyc | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const record = await db.businessKyc.findFirst({
    where: { userId: user.id },
  });

  return (record?.data as BusinessKyc) ?? null;
}

export function stringifyKyc(kyc: BusinessKyc | null): string {
  if (!kyc) return "";
  return JSON.stringify(kyc, null, 2);
}
EOF

########################################
# API: KYC route
########################################
cat <<'EOF' > src/app/api/kyc/route.ts
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
EOF

########################################
# API: generate route
########################################
cat <<'EOF' > src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getKycForCurrentUser, stringifyKyc } from "@/lib/kyc";
import { generateText } from "@/lib/openai";

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
EOF

########################################
# KYC Page + Form
########################################
cat <<'EOF' > src/app/kyc/page.tsx
import KycForm from "@/components/kyc/KycForm";

export default function KycPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div>
        <h1 className="text-xl font-semibold">Business KYC</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tell the AI about your business once. Every reply, caption and
          campaign will use this profile.
        </p>
      </div>
      <KycForm />
    </div>
  );
}
EOF

cat <<'EOF' > src/components/kyc/KycForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { BusinessKyc } from "@/types/kyc";

const EMPTY_KYC: BusinessKyc = {
  businessName: "",
  industry: "",
  shortDescription: "",
  targetAudience: "",
  products: [],
  brandTone: "friendly",
  languagePreference: "hinglish",
  writingStyle: "short",
};

export default function KycForm() {
  const [kyc, setKyc] = useState<BusinessKyc>(EMPTY_KYC);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (res.ok) {
          const data = await res.json();
          if (data) setKyc({ ...EMPTY_KYC, ...data });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSavedMessage("");

    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        body: JSON.stringify(kyc),
      });
      if (res.ok) setSavedMessage("Saved! Your business brain is updated.");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="text-xs text-slate-400">
        Loading your business profile…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-slate-800 rounded-lg p-4 bg-slate-950/60"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Business name</label>
          <input
            className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            value={kyc.businessName}
            onChange={(e) =>
              setKyc({ ...kyc, businessName: e.target.value })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Industry</label>
          <input
            className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            value={kyc.industry}
            onChange={(e) => setKyc({ ...kyc, industry: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-300">Short description</label>
        <textarea
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 min-h-[60px]"
          value={kyc.shortDescription}
          onChange={(e) =>
            setKyc({ ...kyc, shortDescription: e.target.value })
          }
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-300">Target audience</label>
        <input
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
          value={kyc.targetAudience}
          onChange={(e) =>
            setKyc({ ...kyc, targetAudience: e.target.value })
          }
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Brand tone</label>
          <select
            className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs"
            value={kyc.brandTone}
            onChange={(e) =>
              setKyc({ ...kyc, brandTone: e.target.value as any })
            }
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="luxury">Luxury</option>
            <option value="playful">Playful</option>
            <option value="strict">Strict</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Language preference</label>
          <select
            className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs"
            value={kyc.languagePreference}
            onChange={(e) =>
              setKyc({ ...kyc, languagePreference: e.target.value as any })
            }
          >
            <option value="hinglish">Hinglish</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Writing style</label>
          <select
            className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs"
            value={kyc.writingStyle}
            onChange={(e) =>
              setKyc({ ...kyc, writingStyle: e.target.value as any })
            }
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
            <option value="emoji-heavy">Emoji-heavy</option>
            <option value="no-emojis">No emojis</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-300">
          Refund / return / shipping rules (optional)
        </label>
        <textarea
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
          value={kyc.refundPolicy || ""}
          onChange={(e) => setKyc({ ...kyc, refundPolicy: e.target.value })}
          placeholder="Refunds, returns, shipping, COD rules etc."
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1.5 rounded bg-emerald-500 text-black text-xs font-medium disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save KYC"}
        </button>
        {savedMessage && (
          <span className="text-[11px] text-emerald-300">{savedMessage}</span>
        )}
      </div>
    </form>
  );
}
EOF

########################################
# Module shared components
########################################
cat <<'EOF' > src/components/modules/ModuleLayout.tsx
import React from "react";

export default function ModuleLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
      <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
        {children}
      </div>
    </div>
  );
}
EOF

cat <<'EOF' > src/components/modules/PromptOptionsBar.tsx
type Preset = { id: string; label: string };

export default function PromptOptionsBar({
  scenario,
  setScenario,
  presets,
}: {
  scenario: string;
  setScenario: (s: string) => void;
  presets: Preset[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-1">
      <span className="text-[11px] text-slate-400">Scenario:</span>
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setScenario(p.id)}
          className={`px-2 py-0.5 rounded-full text-[11px] border ${
            scenario === p.id
              ? "bg-emerald-500 text-black border-emerald-500"
              : "border-slate-700 text-slate-300 hover:border-emerald-500/70"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
EOF

cat <<'EOF' > src/components/modules/OutputCard.tsx
"use client";

import React, { useState } from "react";

export default function OutputCard({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="mt-3 border border-slate-800 rounded-lg bg-slate-950/80">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <span className="text-[11px] text-slate-400">Generated output</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[11px] px-2 py-0.5 rounded border border-slate-700 hover:border-emerald-500/70"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-xs whitespace-pre-wrap px-3 py-2 text-slate-100">
        {content}
      </pre>
    </div>
  );
}
EOF

########################################
# Reply Assistant module page
########################################
cat <<'EOF' > src/app/modules/reply-assistant/page.tsx
"use client";

import React, { useState } from "react";
import ModuleLayout from "@/components/modules/ModuleLayout";
import PromptOptionsBar from "@/components/modules/PromptOptionsBar";
import OutputCard from "@/components/modules/OutputCard";

export default function ReplyAssistantPage() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [scenario, setScenario] = useState("general");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function handleGenerate() {
    if (!customerMessage.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          moduleId: "reply-assistant",
          input: { customerMessage, scenario },
        }),
      });
      const data = await res.json();
      if (data.result) setOutput(data.result);
      if (data.error) setOutput(`Error: ${data.error}`);
    } catch (e) {
      console.error(e);
      setOutput("Something went wrong while generating. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="Customer Reply Assistant"
      description="Paste a customer message and get a reply tailored to your business profile and policies."
    >
      <div className="flex flex-col gap-3">
        <PromptOptionsBar
          scenario={scenario}
          setScenario={setScenario}
          presets={[
            { id: "general", label: "General" },
            { id: "price-enquiry", label: "Price enquiry" },
            { id: "negotiation", label: "Negotiation" },
            { id: "delivery", label: "Delivery" },
            { id: "return", label: "Return / refund" },
            { id: "complaint", label: "Complaint" },
            { id: "payment-reminder", label: "Payment reminder" },
          ]}
        />

        <textarea
          value={customerMessage}
          onChange={(e) => setCustomerMessage(e.target.value)}
          placeholder="Paste the customer's message here..."
          className="w-full min-h-[140px] rounded bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-1.5 rounded bg-emerald-500 text-black text-xs font-medium disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate reply"}
          </button>
        </div>

        {output && <OutputCard content={output} />}
      </div>
    </ModuleLayout>
  );
}
EOF

########################################
# Placeholder pages for other modules
########################################
for module in website-content whatsapp-broadcast instagram-captions product-descriptions sales-scripts review-requests about-bio
do
  cat <<EOF > src/app/modules/$module/page.tsx
import ModuleLayout from "@/components/modules/ModuleLayout";

export default function ${module//-}Page() {
  return (
    <ModuleLayout
      title="${module//-/ }"
      description="Module UI coming soon. Wire this page to /api/generate with its own prompt."
    >
      <p className="text-xs text-slate-400">
        TODO: Build this module's form, call /api/generate with moduleId="${module}" and render output.
      </p>
    </ModuleLayout>
  );
}
EOF
done

echo "✅ Bootstrap complete. Now run: npm run dev"
