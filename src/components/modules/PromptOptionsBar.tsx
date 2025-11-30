type Preset = { id: string; label: string };

export default function PromptOptionsBar({
  scenario,
  setScenario,
  presets,
}: {
  scenario: string;
  setScenario: (s: string) => void;
  presets: Preset[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-1">
      <span className="text-[11px] text-slate-400">Scenario:</span>
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setScenario(p.id)}
          className={`px-2 py-0.5 rounded-full text-[11px] border ${
            scenario === p.id
              ? "bg-emerald-500 text-black border-emerald-500"
              : "border-slate-700 text-slate-300 hover:border-emerald-500/70"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
