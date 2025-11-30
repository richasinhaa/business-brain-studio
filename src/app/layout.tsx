import React from "react";
import "@/styles/globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Business Brain Studio",
  description: "Enter your business once. Generate everything you need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
