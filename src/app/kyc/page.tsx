import KycForm from "@/components/kyc/KycForm";

export default function KycPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div>
        <h1 className="text-xl font-semibold">Business KYC</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tell the AI about your business once. Every reply, caption and
          campaign will use this profile.
        </p>
      </div>
      <KycForm />
    </div>
  );
}
