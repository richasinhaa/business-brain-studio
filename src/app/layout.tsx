// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Business Brain Studio",
  description: "AI workspace for small businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)]">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
