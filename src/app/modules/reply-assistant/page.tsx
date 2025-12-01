// src/app/modules/customer-reply/page.tsx
"use client";

import React, { useState } from "react";
import ModuleLayout from "@/components/modules/ModuleLayout";
import OutputCard from "@/components/modules/OutputCard";

type Channel = "whatsapp" | "instagram" | "email" | "other";
type Tone = "friendly" | "formal" | "empathetic" | "playful";
type Mode = "normal" | "negotiation" | "complaint";

export default function CustomerReplyModulePage() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [tone, setTone] = useState<Tone>("friendly");
  const [mode, setMode] = useState<Mode>("normal");
  const [language, setLanguage] = useState<"hinglish" | "english" | "hindi">(
    "hinglish"
  );

  const [customerMessage, setCustomerMessage] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOutput("");

    if (!customerMessage.trim()) {
      setError("Paste the customer message first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate/customer-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "customer-reply",
          channel,
          tone,
          mode,
          language,
          customerMessage,
          extraContext,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error || "Something went wrong while generating."
        );
      }

      const data = (await res.json()) as { text?: string };
      setOutput(data.text || "");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Unexpected error. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  }

  const labelClass =
    "text-[11px] font-medium text-[var(--card-muted-fg)] tracking-tight";
  const inputClass =
    "w-full rounded-md border px-3 py-2 text-xs md:text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-fg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-bg)] focus:border-transparent transition";
  const textareaClass = `${inputClass} min-h-[100px]`;

  return (
    <ModuleLayout
      title="Customer Reply Assistant"
      description="Paste customer messages from WhatsApp, Instagram, email or anywhere, and get clear replies that follow your Business KYC profile."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CONFIG BAR – compact, no pills */}
        <section className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-3 space-y-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-[var(--card-muted-fg)]">
              Reply settings
            </p>
            <p className="text-[10px] text-[var(--card-muted-fg)]">
              Uses your saved products, policies and tone from Business KYC.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1">
              <label className={labelClass}>Channel</label>
              <select
                className={inputClass}
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram DM</option>
                <option value="email">Email</option>
                <option value="other">Other / generic</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Mode</label>
              <select
                className={inputClass}
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
              >
                <option value="normal">Normal query</option>
                <option value="negotiation">Price / negotiation</option>
                <option value="complaint">Angry / complaint</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Tone</label>
              <select
                className={inputClass}
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
              >
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="empathetic">Empathetic</option>
                <option value="playful">Playful</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Language</label>
              <select
                className={inputClass}
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "hinglish" | "english" | "hindi")
                }
              >
                <option value="hinglish">Hinglish</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT – left inputs, right small tips */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
          {/* LEFT: message + context */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className={labelClass}>
                1. Paste the customer&apos;s message
              </label>
              <textarea
                className={`${textareaClass} min-h-[140px]`}
                placeholder={`Paste the exact message your customer sent.\nExample: "Hi, I ordered yesterday and still haven’t got any tracking details. When will my order arrive?"`}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                2. Extra details for this chat (optional)
              </label>
              <textarea
                className={textareaClass}
                placeholder="Order ID, promises you already made, special cases, or anything the AI should know before replying."
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
              />
              <p className="text-[10px] text-[var(--card-muted-fg)]">
                You don&apos;t need to repeat policies or product details here —
                those already come from your Business KYC.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[10px] text-[var(--card-muted-fg)]">
                The reply will automatically match your saved tone, policies and
                pricing rules.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[var(--accent-bg)] text-[var(--accent-fg)] text-xs md:text-sm font-semibold disabled:opacity-60 shadow-sm hover:brightness-105 transition"
              >
                {loading ? "Generating…" : "Generate reply"}
              </button>
            </div>

            {error && (
              <div className="text-[11px] text-red-500 mt-1">{error}</div>
            )}

            {output && <OutputCard content={output} />}
          </div>

          {/* RIGHT: simple, non-busy tips card */}
          <aside className="space-y-3 text-[11px] text-[var(--card-muted-fg)]">
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-3 py-3 space-y-1.5 shadow-sm">
              <p className="font-semibold text-[var(--card-muted-fg)]">
                Best practices
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Paste the customer message exactly as they sent it.</li>
                <li>
                  Use complaint mode only when the customer is clearly upset.
                </li>
                <li>
                  For discounts, mention your max flexibility in the extra
                  details box.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-3 py-3 space-y-1.5 shadow-sm">
              <p className="font-semibold text-[var(--card-muted-fg)]">
                Coming soon
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Save favourite replies as templates.</li>
                <li>One-click copy to WhatsApp Web / Instagram.</li>
                <li>Reply history for each customer.</li>
              </ul>
            </div>
          </aside>
        </section>
      </form>
    </ModuleLayout>
  );
}
