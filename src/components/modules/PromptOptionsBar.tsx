"use client";

import React from "react";

type Preset = {
  id: string;
  label: string;
};

interface PromptOptionsBarProps {
  scenario: string;
  setScenario: (id: string) => void;
  presets: Preset[];
}

export default function PromptOptionsBar({
  scenario,
  setScenario,
  presets,
}: PromptOptionsBarProps) {
  if (!presets) return null;

  return (
    <div className="rounded border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--muted-fg)]">Scenario:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => {
            const isActive = preset.id === scenario;

            const base =
              "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors";

            const activeClasses =
              "bg-[var(--accent-bg)] text-[var(--accent-fg)] border-[var(--accent-bg)] shadow-sm";

            const inactiveClasses =
              // all driven by your theme tokens
              "bg-transparent text-[var(--muted-fg)] border-[var(--border-color)] " +
              "hover:bg-[var(--card-bg)] hover:text-[var(--page-fg)]";

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setScenario(preset.id)}
                className={`${base} ${isActive ? activeClasses : inactiveClasses}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
