"use client";

import React, { useState } from "react";
import ModuleLayout from "@/components/modules/ModuleLayout";
import PromptOptionsBar from "@/components/modules/PromptOptionsBar";
import OutputCard from "@/components/modules/OutputCard";

export default function ReplyAssistantPage() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [scenario, setScenario] = useState("general");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function handleGenerate() {
    if (!customerMessage.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          moduleId: "reply-assistant",
          input: { customerMessage, scenario },
        }),
      });
      const data = await res.json();
      if (data.result) setOutput(data.result);
      if (data.error) setOutput(`Error: ${data.error}`);
    } catch (e) {
      console.error(e);
      setOutput("Something went wrong while generating. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="Customer Reply Assistant"
      description="Paste a customer message and get a reply tailored to your business profile and policies."
    >
      <div className="flex flex-col gap-3">
        <PromptOptionsBar
          scenario={scenario}
          setScenario={setScenario}
          presets={[
            { id: "general", label: "General" },
            { id: "price-enquiry", label: "Price enquiry" },
            { id: "negotiation", label: "Negotiation" },
            { id: "delivery", label: "Delivery" },
            { id: "return", label: "Return / refund" },
            { id: "complaint", label: "Complaint" },
            { id: "payment-reminder", label: "Payment reminder" },
          ]}
        />

        <textarea
          value={customerMessage}
          onChange={(e) => setCustomerMessage(e.target.value)}
          placeholder="Paste the customer's message here..."
          className="w-full min-h-[140px] rounded border px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-fg)]"
        />

        <div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-1.5 rounded bg-[var(--accent-bg)] text-[var(--accent-fg)] text-xs font-medium disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate reply"}
          </button>
        </div>

        {output && <OutputCard content={output} />}
      </div>
    </ModuleLayout>
  );
}
