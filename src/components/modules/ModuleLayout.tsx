// src/components/modules/ModuleLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ModuleLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ModuleLayout({
  title,
  description,
  children,
}: ModuleLayoutProps) {
  const [checked, setChecked] = useState(false);
  const [hasKyc, setHasKyc] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setHasKyc(true);
          } else {
            setHasKyc(false);
            router.replace("/kyc?from=module");
          }
        } else {
          setHasKyc(false);
          router.replace("/kyc?from=module");
        }
      } catch {
        setHasKyc(false);
        router.replace("/kyc?from=module");
      } finally {
        setChecked(true);
      }
    })();
  }, [router]);

  if (!checked || !hasKyc) {
    return (
      <div className="text-xs text-[var(--muted-fg)]">
        Checking your business profile…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <header className="space-y-1">
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="text-xs text-[var(--muted-fg)]">{description}</p>
      </header>
      <div className="border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] p-4">
        {children}
      </div>
    </div>
  );
}
