"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { MODULES } from "@/lib/modules/registry";

type Theme = "light" | "dark";

const KYC_STORAGE_KEY = "bbs_kyc_cache_v3";

type KycUpdatedDetail = {
  businessName?: string;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";
  const router = useRouter();
  const { data: session } = useSession();

  const [theme, setTheme] = useState<Theme>("light");
  const [businessName, setBusinessName] = useState<string | null>(null);

  const isAuthPage = pathname === "/login";

  /* ========== THEME HANDLING ========== */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("bbs-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bbs-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ========== KYC PREFETCH + SIDEBAR NAME ========== */

  useEffect(() => {
    if (!session?.user) return;

    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (!res.ok) {
          setBusinessName(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(KYC_STORAGE_KEY);
          }
          return;
        }

        const data = await res.json();

        if (typeof window !== "undefined" && data) {
          window.localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(data));
        }

        if (data?.businessName && typeof data.businessName === "string") {
          setBusinessName(data.businessName);
        } else {
          setBusinessName(null);
        }
      } catch {
        setBusinessName(null);
      }
    })();
  }, [session?.user]);

  // Listen for KYC updates from the form (only used for sidebar label)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<KycUpdatedDetail>;
      const name = customEvent.detail?.businessName;
      if (typeof name === "string") {
        setBusinessName(name);
      }
    };

    window.addEventListener("bbs-kyc-updated", handler as EventListener);
    return () => {
      window.removeEventListener("bbs-kyc-updated", handler as EventListener);
    };
  }, []);

  const displayName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Workspace";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "B";

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(KYC_STORAGE_KEY);
      }
    } catch {
      // ignore
    }

    try {
      await signOut({ redirect: false });
    } finally {
      router.replace("/login");
    }
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)]">
        <header className="border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between bg-[var(--card-bg)]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              Business Brain Studio
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--accent-soft-bg)] text-[var(--accent-bg)]">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
            <span>AI for Small Businesses</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--border-color)] text-[11px] hover:border-[var(--accent-bg)] bg-[var(--card-bg)]/70"
            >
              <span className="text-[13px]">
                {theme === "dark" ? "🌙" : "☀️"}
              </span>
              <span>{theme === "dark" ? "Dark" : "Light"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
          <div className="w-full max-w-5xl">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Top bar */}
      <header className="border-b border-[var(--border-color)] px-4 md:px-6 py-3 flex items-center justify-between bg-[var(--card-bg)]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-[-0.01em]">
            Business Brain Studio
          </span>
          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[var(--accent-soft-bg)] text-[var(--accent-bg)]">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
          <span className="hidden sm:inline">AI for Small Businesses</span>

          {session?.user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--page-bg)]/70 border border-[var(--border-color)]">
                <div className="h-6 w-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-semibold text-[var(--page-fg)]">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate text-[11px] text-[var(--page-fg)]">
                  {displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] px-2 py-1 rounded-full border border-[var(--border-color)] hover:border-red-500/70 hover:text-red-500 bg-[var(--card-bg)]/70"
              >
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--border-color)] text-[11px] hover:border-[var(--accent-bg)] bg-[var(--card-bg)]/70"
          >
            <span className="text-[13px]">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block w-60 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)]/95">
          <div className="h-full flex flex-col px-3 py-4 gap-4">
            {/* Workspace summary */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[var(--accent-soft-bg)] flex items-center justify-center text-[var(--accent-bg)] text-xs font-semibold">
                BB
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[11px] font-medium tracking-wide">
                  Navigation
                </span>
                <span className="text-[10px] text-[var(--muted-fg)] truncate">
                  {businessName || "Set up your workspace"}
                </span>
              </div>
            </div>

            {/* Primary nav */}
            <nav className="flex flex-col gap-1.5 text-xs">
              <NavItem href="/" label="Dashboard" active={pathname === "/"} />
              <NavItem
                href="/kyc"
                label={businessName || "Business KYC"}
                caption={businessName ? "Edit business profile" : "Set up KYC"}
                active={pathname.startsWith("/kyc")}
              />
            </nav>

            {/* Modules section */}
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted-fg)] mb-1.5">
                Modules
              </div>
              <nav className="flex flex-col gap-1.5 text-xs">
                {MODULES.map((m) => {
                  const active = pathname.startsWith(m.route);
                  return (
                    <NavItem
                      key={m.id}
                      href={m.route}
                      label={m.name}
                      icon={m.icon}
                      active={active}
                      compact
                    />
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto pt-3 text-[9px] text-[var(--muted-fg)] border-t border-dashed border-[var(--border-color)]">
              All modules reuse your saved KYC automatically.
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6">
          <div className="max-w-5xl mx-auto space-y-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  caption?: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  compact?: boolean;
};

function NavItem({
  href,
  label,
  caption,
  icon: Icon,
  active,
  compact,
}: NavItemProps) {
  const base =
    "group flex items-center gap-2 rounded-md px-2.5 py-1.5 cursor-pointer border border-transparent transition-colors";
  const activeClasses =
    "bg-[var(--accent-soft-bg)] text-[var(--accent-bg)] border-[var(--accent-bg)]/70 shadow-[0_1px_3px_rgba(15,23,42,0.12)]";
  const inactiveClasses =
    "text-[var(--muted-fg)] hover:bg-[var(--card-bg)] hover:border-[var(--border-color)]";

  return (
    <Link href={href} className={`${base} ${active ? activeClasses : inactiveClasses}`}>
      {Icon && (
        <span className="shrink-0">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="flex flex-col min-w-0">
        <span className="truncate text-[12px]">{label}</span>
        {caption && !compact && (
          <span className="truncate text-[10px] text-[var(--muted-fg)] group-hover:text-[var(--card-muted-fg)]">
            {caption}
          </span>
        )}
      </div>
    </Link>
  );
}
