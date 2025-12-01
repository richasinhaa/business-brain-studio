"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const KYC_STORAGE_KEY = "bbs_kyc_cache_v3";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clearing, setClearing] = useState(false);
  const [clearedMessage, setClearedMessage] = useState("");

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/settings");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="text-xs text-[var(--muted-fg)]">
        Checking your session…
      </div>
    );
  }

  if (!session?.user) {
    // brief fallback while redirect happens
    return null;
  }

  const handleClearLocalKyc = () => {
    setClearing(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(KYC_STORAGE_KEY);
      }
      setClearedMessage("Local KYC cache cleared on this device ✔");
      setTimeout(() => setClearedMessage(""), 2500);
    } catch {
      setClearedMessage("Could not clear local cache. Please try again.");
      setTimeout(() => setClearedMessage(""), 2500);
    } finally {
      setClearing(false);
    }
  };

  const handleLogoutEverywhere = async () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(KYC_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    await signOut({ callbackUrl: "/login" });
  };

  const name =
    session.user.name ||
    session.user.email?.split("@")[0] ||
    "Workspace owner";

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-[-0.02em]">
          Settings
        </h1>
        <p className="text-sm text-[var(--muted-fg)] max-w-2xl">
          Manage your account, business data and workspace preferences for
          Business Brain Studio.
        </p>
      </header>

      {/* ACCOUNT CARD */}
      <section className="bbs-card p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Account</h2>
            <p className="text-xs text-[var(--muted-fg)]">
              Your login and identity in this workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogoutEverywhere}
            className="text-[11px] px-3 py-1.5 rounded-md border border-[var(--border-color)] hover:border-red-500 hover:text-red-500 transition"
          >
            Logout from this browser
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--card-muted-fg)]">
              Name
            </label>
            <input
              className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
              value={name}
              readOnly
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--card-muted-fg)]">
              Email
            </label>
            <input
              className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
              value={session.user.email ?? ""}
              readOnly
            />
          </div>
        </div>

        <p className="text-[10px] text-[var(--card-muted-fg)]">
          Business Brain Studio only uses your email and name for login and
          linking your business KYC to your account.
        </p>
      </section>

      {/* BUSINESS DATA / KYC */}
      <section className="bbs-card p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Business data</h2>
            <p className="text-xs text-[var(--muted-fg)]">
              Control how your Business KYC is stored and used.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/kyc")}
            className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--accent-bg)] text-[var(--accent-fg)] font-medium shadow-sm hover:brightness-105 transition"
          >
            Open Business KYC
          </button>
        </div>

        <ul className="text-[11px] text-[var(--card-muted-fg)] list-disc pl-4 space-y-1">
          <li>
            Your full KYC is stored securely on the server and re-used by all
            modules (replies, captions, scripts, campaigns).
          </li>
          <li>
            A copy is cached locally on this device ({KYC_STORAGE_KEY}) so
            forms load faster.
          </li>
        </ul>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearLocalKyc}
            disabled={clearing}
            className="text-[11px] px-3 py-1.5 rounded-md border border-[var(--border-color)] hover:border-[var(--accent-bg)] hover:text-[var(--accent-bg)] disabled:opacity-60 transition"
          >
            {clearing ? "Clearing local cache…" : "Clear local KYC cache"}
          </button>

          {clearedMessage && (
            <span className="text-[10px] text-[var(--card-muted-fg)]">
              {clearedMessage}
            </span>
          )}
        </div>
      </section>

      {/* APPEARANCE / THEME NOTE */}
      <section className="bbs-card p-4 md:p-5 space-y-3">
        <h2 className="text-sm font-medium">Appearance</h2>
        <p className="text-xs text-[var(--muted-fg)]">
          Switch between light and dark mode using the toggle in the top bar.
          Your choice is saved per browser.
        </p>
        <p className="text-[10px] text-[var(--card-muted-fg)]">
          Theme is stored as <code>bbs-theme</code> in localStorage.
        </p>
      </section>
    </div>
  );
}
