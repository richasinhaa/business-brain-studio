// src/app/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MODULES } from "@/lib/modules/registry";
import { BusinessKyc } from "@/types/kyc";

// --- Completion logic mirroring KYC form (typing relaxed a bit for TS) ---
function calculateCompletion(kyc: BusinessKyc | null) {
  if (!kyc) {
    return { percent: 0, filled: 0, total: 0 };
  }

  const importantFields = [
    "businessName",
    "shortDescription",
    "industry",
    "locationCity",
    "locationCountry",
    "websiteUrl",
    "whatsappNumber",
    "instagramHandle",
    "targetAudience",
    "mainPainPoints",
    "dreamOutcome",
    "shippingSummary",
    "returnPolicySummary",
    "refundPolicySummary",
    "paymentMethods",
    "serviceHours",
    "policyText",
  ] as const;

  let total = importantFields.length + 1; // +1 for "has at least one offer"
  let filled = 0;

  importantFields.forEach((key) => {
    // Relaxed type here because BusinessKyc may not declare every string literal
    const val = (kyc as any)[key] as unknown;
    if (typeof val === "string" && val.trim().length > 0) {
      filled += 1;
    }
  });

  const hasOffer =
    Array.isArray(kyc.products) &&
    kyc.products.some(
      (p) =>
        (p.name && p.name.trim().length > 0) ||
        (p.shortDescription && p.shortDescription.trim().length > 0) ||
        (p.priceText && p.priceText.trim().length > 0)
    );

  if (hasOffer) filled += 1;

  const percent = total === 0 ? 0 : Math.round((filled / total) * 100);

  return { percent, filled, total };
}

export default function DashboardPage() {
  const [kyc, setKyc] = useState<BusinessKyc | null>(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (res.ok) {
          const data = await res.json();
          setKyc((data || null) as BusinessKyc | null);
        } else {
          setKyc(null);
        }
      } catch {
        setKyc(null);
      } finally {
        setLoadingKyc(false);
      }
    })();
  }, []);

  const completion = calculateCompletion(kyc);

  const rawBusinessName = kyc?.businessName?.trim() || "";
  const hasProfileName = !!rawBusinessName && completion.percent > 0;

  // Before KYC: "Set up your business", after KYC: actual business name
  const workspaceLabel = hasProfileName
    ? rawBusinessName
    : "Set up your business";

  const canUseModules = completion.percent > 0 && !loadingKyc;

  const quickActions = useMemo(
    () =>
      MODULES.slice(0, 3).map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        route: m.route,
        icon: m.icon,
      })),
    []
  );

  return (
    <div className="space-y-5">
      {/* Top header + workspace chip */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.01em]">
            Business Brain Studio
          </h1>
          <p className="text-sm text-[var(--muted-fg)] mt-1">
            One premium workspace for your business KYC, replies, content, and
            campaigns.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="px-3 py-1 rounded-full bg-[var(--accent-soft-bg)] text-[11px] text-[var(--accent-bg)] flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-bg)]" />
            Workspace: <span className="font-medium">{workspaceLabel}</span>
          </div>
          {completion.percent > 0 && (
            <span className="text-[11px] text-[var(--card-muted-fg)]">
              Profile {completion.percent}% complete · All modules use this
              automatically.
            </span>
          )}
        </div>
      </header>

      {/* Hero / KYC overview */}
      <section className="bbs-card bbs-hero p-4 md:p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-sm font-medium">
              {completion.percent === 100
                ? "Your business profile is ready"
                : completion.percent > 0
                ? "Finish your business profile"
                : "Set up your business profile"}
            </h2>
            <p className="text-xs text-[var(--muted-fg)]">
              {completion.percent === 100
                ? "We’ll use this profile for all modules – replies, captions, scripts and campaigns. Update it whenever your offers change."
                : "Tell the AI about your business once. Unlock tailored content across every module – from WhatsApp replies to website copy."}
            </p>
            {hasProfileName && (
              <p className="text-[11px] text-[var(--card-muted-fg)]">
                Using profile for{" "}
                <span className="font-medium">{rawBusinessName}</span>.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-[230px]">
            <div className="text-right space-y-1">
              <span className="block text-[11px] text-[var(--card-muted-fg)]">
                KYC completion
              </span>
              <div className="flex items-center gap-2">
                <div className="w-36 h-1.5 rounded-full bg-[var(--page-bg)] overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-bg)] transition-all"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium">
                  {completion.percent}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              {completion.percent < 100 && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--info-bg)] text-[var(--info-fg)]">
                  {completion.filled}/{completion.total} key details filled.
                </span>
              )}
              <Link
                href="/kyc"
                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded-full bg-[var(--accent-bg)] text-[var(--accent-fg)] font-medium no-underline shadow-sm hover:brightness-105 transition"
              >
                {completion.percent === 100
                  ? "Edit Business KYC"
                  : "Complete Business KYC"}
              </Link>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[var(--card-muted-fg)] flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-[var(--border-color)]">
          <span>Pro tip:</span>
          <span>
            Start with customer replies, then repurpose the same message into
            captions, product descriptions and call scripts.
          </span>
        </div>
      </section>

      {/* Quick actions row */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Quick actions</h2>
          <span className="text-[11px] text-[var(--card-muted-fg)]">
            Jump into your most-used modules in one click.
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((qa) => {
            const locked = !canUseModules;
            const href = locked ? "/kyc" : qa.route;
            const Icon = qa.icon;

            return (
              <Link
                key={qa.id}
                href={href}
                className="border border-[var(--border-color)] rounded-xl p-3 bg-[var(--card-bg)] hover:bg-[var(--accent-soft-bg)]/60 hover:border-[var(--accent-bg)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.16)] transition-all text-left no-underline text-[var(--page-fg)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{qa.name}</span>
                  </div>
                  {locked && !loadingKyc && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--info-bg)] text-[var(--info-fg)]">
                      KYC first
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-fg)] line-clamp-2">
                  {qa.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Modules grid */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">All modules</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => {
            const locked = !canUseModules;
            const href = locked ? "/kyc" : m.route;
            const Icon = m.icon;

            return (
              <Link
                key={m.id}
                href={href}
                className="border border-[var(--border-color)] rounded-2xl p-3 bg-[var(--card-bg)] hover:bg-[var(--accent-soft-bg)]/60 hover:border-[var(--accent-bg)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.16)] transition-all text-left no-underline text-[var(--page-fg)] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>

                  {locked && !loadingKyc ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--info-bg)] text-[var(--info-fg)]">
                      KYC first
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-soft-bg)] text-[var(--accent-bg)]">
                      Uses KYC
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--muted-fg)]">
                  {m.description}
                </p>

                {locked && !loadingKyc && (
                  <p className="text-[10px] text-[var(--card-muted-fg)] pt-1">
                    Complete Business KYC once to unlock this module.
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Simple insights / coming soon card */}
      <section className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="border border-[var(--border-color)] rounded-2xl p-3 bg-[var(--card-bg)]">
          <h3 className="text-xs font-medium mb-1.5">Coming soon: Insights</h3>
          <p className="text-[11px] text-[var(--muted-fg)] mb-2">
            You’ll soon see how many replies, captions and scripts you’ve
            generated for each module, plus your most-used tones and offers.
          </p>
          <ul className="text-[11px] text-[var(--card-muted-fg)] list-disc pl-4 space-y-1">
            <li>Daily and weekly generation stats</li>
            <li>Top-performing content types</li>
            <li>Easy export of prompts & outputs</li>
          </ul>
        </div>

        <div className="border border-[var(--border-color)] rounded-2xl p-3 bg-[var(--card-bg)]">
          <h3 className="text-xs font-medium mb-1.5">Workspace tips</h3>
          <p className="text-[11px] text-[var(--muted-fg)]">
            Keep your KYC sharp: whenever you change pricing, offers, or brand
            voice, update it once here and every module stays in sync.
          </p>
        </div>
      </section>
    </div>
  );
}
