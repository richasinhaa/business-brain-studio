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
    <div className="mt-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)]">
        <span className="text-[11px] text-[var(--muted-fg)]">
          Generated output
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[11px] px-2 py-0.5 rounded border border-[var(--border-color)] hover:border-emerald-500/70"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-xs whitespace-pre-wrap px-3 py-2">
        {content}
      </pre>
    </div>
  );
}
