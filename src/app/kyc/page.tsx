// src/app/kyc/page.tsx
import KycForm from "@/components/kyc/KycForm";

export default function KycPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-[-0.02em]">
          Business KYC
        </h1>
        <p className="text-sm text-[var(--muted-fg)]">
          Tell the AI about your business once. Every reply, caption and
          campaign will use this profile.
        </p>
      </header>

      <section className="bbs-card p-4 md:p-5">
        <KycForm />
      </section>
    </div>
  );
}
