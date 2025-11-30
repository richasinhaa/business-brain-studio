import { MODULES } from "@/lib/modules/registry";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Business Brain Studio</h1>
        <p className="text-sm text-[var(--muted-fg)] mt-1">
          Fill your business KYC once, then generate replies, content, and
          campaigns tailored to you.
        </p>
      </header>

      <section className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--card-bg)]">
        <h2 className="text-sm font-medium mb-2">Get started</h2>
        <p className="text-xs text-[var(--muted-fg)] mb-3">
          1. Complete your Business KYC. 2. Pick a module. 3. Generate content
          in your brand voice.
        </p>
        <a
          href="/kyc"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded bg-[var(--accent-bg)] text-[var(--accent-fg)] font-medium"
        >
          Complete Business KYC
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Modules</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => (
            <a
              key={m.id}
              href={m.route}
              className="border border-[var(--border-color)] rounded-lg p-3 bg-[var(--card-bg)] hover:border-emerald-500/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{m.icon}</span>
                <span className="text-sm font-medium">{m.name}</span>
              </div>
              <p className="text-xs text-[var(--muted-fg)]">
                {m.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
