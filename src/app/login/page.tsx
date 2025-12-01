"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  return (
    <div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
      {/* LEFT – product pitch */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)]/40 px-3 py-1">
          <span className="h-5 w-5 rounded-full bg-emerald-500/80 flex items-center justify-center text-[11px] font-semibold text-white">
            BB
          </span>
          <span className="text-[11px] font-medium text-[var(--card-muted-fg)] tracking-wide">
            AI workspace for small businesses
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Create or access your Business Brain workspace.
          </h1>
          <p className="text-sm text-[var(--muted-fg)] max-w-xl">
            Sign in once with Google and we&apos;ll remember your business KYC
            across WhatsApp replies, captions, product descriptions and sales
            scripts – so everything stays on-brand.
          </p>
        </div>

        <ul className="space-y-2 text-sm text-[var(--muted-fg)]">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Customer replies tailored to your policies and tone.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Captions, scripts & descriptions generated in your style.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>One profile powering every module – no repeated briefings.</span>
          </li>
        </ul>
      </section>

      {/* RIGHT – login card */}
      <section className="flex justify-center md:justify-end">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg px-6 py-7 md:px-7 md:py-8 space-y-5">
          <header className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--card-muted-fg)]">
              Business Brain Studio
            </p>
            <h2 className="text-lg font-semibold">Sign in with Google</h2>
            <p className="text-xs text-[var(--card-muted-fg)]">
              New here? We&apos;ll create a workspace for you.  
              Already using it? We&apos;ll log you back into your saved one.
            </p>
          </header>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2.5 text-xs font-medium hover:border-[var(--accent-bg)] hover:bg-[var(--page-bg)]/60 transition shadow-sm"
          >
            <span className="h-5 w-5 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[11px] font-semibold">
              G
            </span>
            <span>Continue with Google</span>
          </button>

          <div className="border-t border-[var(--border-color)] pt-3 text-[10px] text-[var(--card-muted-fg)] space-y-1">
            <p>No separate signup required – your first login creates your account.</p>
            <p>We never post or message anyone on your behalf.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
