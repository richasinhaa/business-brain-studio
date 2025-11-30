"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules/registry";

type Theme = "light" | "dark";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount: read from localStorage or prefers-color-scheme
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("bbs-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Sync theme → <html data-theme> + localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("bbs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Top bar */}
      <header className="border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Business Brain Studio</span>
          <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
          <span>AI for Small Businesses</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--border-color)] text-[11px] hover:border-emerald-500/70"
          >
            <span className="text-[13px]">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[var(--border-color)] p-3 hidden md:block bg-[var(--sidebar-bg)]">
          <div className="mb-3 text-[10px] uppercase tracking-wide text-[var(--muted-fg)]">
            Navigation
          </div>
          <nav className="flex flex-col gap-1 mb-4">
            <Link
              href="/"
              className={`px-2 py-1.5 rounded text-xs ${
                pathname === "/"
                  ? "bg-[var(--accent-bg)] text-[var(--accent-fg)]"
                  : "text-[color:rgba(2,6,23,0.8)] dark:text-[color:rgba(249,250,251,0.8)] hover:bg-[var(--card-bg)]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/kyc"
              className={`px-2 py-1.5 rounded text-xs ${
                pathname.startsWith("/kyc")
                  ? "bg-[var(--accent-bg)] text-[var(--accent-fg)]"
                  : "text-[color:rgba(2,6,23,0.8)] dark:text-[color:rgba(249,250,251,0.8)] hover:bg-[var(--card-bg)]"
              }`}
            >
              Business KYC
            </Link>
          </nav>

          <div className="mb-2 text-[10px] uppercase tracking-wide text-[var(--muted-fg)]">
            Modules
          </div>
          <nav className="flex flex-col gap-1 text-xs">
            {MODULES.map((m) => {
              const active = pathname.startsWith(m.route);
              return (
                <Link
                  key={m.id}
                  href={m.route}
                  className={`px-2 py-1.5 rounded flex items-center gap-2 ${
                    active
                      ? "bg-[var(--accent-bg)] text-[var(--accent-fg)]"
                      : "text-[color:rgba(2,6,23,0.8)] dark:text-[color:rgba(249,250,251,0.8)] hover:bg-[var(--card-bg)]"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </Link>
              );
            })}
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
