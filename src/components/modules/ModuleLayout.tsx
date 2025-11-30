import React from "react";

export default function ModuleLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-[var(--muted-fg)] mt-1">{description}</p>
        )}
      </div>
      <div className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--card-bg)]">
        {children}
      </div>
    </div>
  );
}
