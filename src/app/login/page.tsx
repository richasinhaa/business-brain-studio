// src/app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // Safely read callbackUrl, fallback to "/"
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  // If already authenticated, redirect to callbackUrl
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
      {/* Left side: marketing / explanation */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.03em]">
            Log in to Business Brain Studio
          </h1>
          <p className="text-sm text-[var(--muted-fg)] max-w-md">
            Connect once with your Google account, set up your Business KYC, and
            generate replies, content and campaigns in your brand voice.
          </p>
        </div>

        <ul className="space-y-2 text-xs text-[var(--muted-fg)]">
          <li>• Single workspace for your business profile and offers.</li>
          <li>• WhatsApp replies, Instagram captions, website copy and more.</li>
          <li>• Guardrails so the AI follows your policies and tone.</li>
        </ul>

        <p className="text-[11px] text-[var(--card-muted-fg)]">
          You can update or delete your data anytime from inside your account.
        </p>
      </div>

      {/* Right side: login card */}
      <div className="border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)]/95 shadow-sm p-5 md:p-6 space-y-5 max-w-md ml-auto">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">Continue with Google</h2>
          <p className="text-[11px] text-[var(--card-muted-fg)]">
            We only use your email and name to create your workspace. No
            password needed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-[var(--accent-bg)] text-[var(--accent-fg)] shadow-sm hover:brightness-105 transition"
        >
          <span className="text-base">🔐</span>
          <span>Continue with Google</span>
        </button>

        {status === "loading" && (
          <p className="text-[11px] text-[var(--card-muted-fg)]">
            Checking your session…
          </p>
        )}

        <div className="border-t border-[var(--border-color)] pt-3 mt-1">
          <p className="text-[10px] text-[var(--card-muted-fg)] leading-relaxed">
            By continuing, you agree that Business Brain Studio will store your
            business KYC (like brand name, offers, and policies) to generate
            content for you. You can clear or update this anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
