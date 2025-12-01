// src/components/kyc/KycForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  BusinessKyc,
  ProductItem,
  BusinessModel,
  BrandTone,
  LanguagePreference,
  WritingStyle,
  EmojiPreference,
} from "@/types/kyc";

const STORAGE_KEY = "bbs_kyc_cache_v3";

type Step = 0 | 1 | 2 | 3;

const stepLabels = [
  "Basics",
  "Products & Pricing",
  "Audience & Voice",
  "Policies & Guardrails",
];

const stepDescriptions: string[] = [
  "Core identity that every module will lean on.",
  "Key offers and price points for smarter replies & copy.",
  "Who you sell to and how you sound everywhere.",
  "Shipping, returns, payments & rules the AI must follow.",
];

type KycUpdatedDetail = {
  businessName?: string;
};

// -------- Defaults --------
const makeDefaultProduct = (index: number): ProductItem => ({
  id: `product-${index}`,
  name: "",
  shortDescription: "",
  priceText: "",
  category: "",
  isBestSeller: false,
});

const EMPTY_KYC: BusinessKyc = {
  // Page 1 – Basics
  businessName: "",
  tagline: "",
  shortDescription: "",
  industry: "",
  businessModel: "product",
  locationCity: "",
  locationCountry: "India",
  websiteUrl: "",
  whatsappNumber: "",
  instagramHandle: "",

  // Page 2 – Products
  products: [],

  // Page 3 – Audience & Voice
  targetAudience: "",
  mainPainPoints: "",
  dreamOutcome: "",
  brandTone: "friendly",
  languagePreference: "hinglish",
  writingStyle: "short",
  emojiPreference: "few-emojis",

  // Page 4 – Policies
  shippingSummary: "",
  returnPolicySummary: "",
  refundPolicySummary: "",
  paymentMethods: "",
  serviceHours: "",
  policyText: "",
  policyUrl: "",

  testimonials: [],
  faqItems: [],
};

// --- Completion helper ---
function calculateCompletion(kyc: BusinessKyc) {
  // Fields that matter for a “strong” profile (all still optional in the UI)
  const importantFields: (keyof BusinessKyc)[] = [
    "businessName",
    "shortDescription",
    "industry",
    "locationCity",
    "locationCountry",
    "websiteUrl",
    "whatsappNumber",
    "instagramHandle",
    "targetAudience",
    "mainPainPoints",
    "dreamOutcome",
    "shippingSummary",
    "returnPolicySummary",
    "refundPolicySummary",
    "paymentMethods",
    "serviceHours",
    "policyText",
  ];

  const total = importantFields.length + 1; // +1 for "has at least one offer"
  let filled = 0;

  importantFields.forEach((key) => {
    const val = kyc[key];
    if (typeof val === "string" && val.trim().length > 0) {
      filled += 1;
    }
  });

  const hasOffer =
    Array.isArray(kyc.products) &&
    kyc.products.some(
      (p) =>
        (p.name && p.name.trim().length > 0) ||
        (p.shortDescription && p.shortDescription.trim().length > 0) ||
        (p.priceText && p.priceText.trim().length > 0)
    );

  if (hasOffer) filled += 1;

  const percent = total === 0 ? 0 : Math.round((filled / total) * 100);

  return { percent, filled, total };
}

export default function KycForm() {
  const [kyc, setKyc] = useState<BusinessKyc>(EMPTY_KYC);
  const [step, setStep] = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ---------- Load local instantly ----------
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setKyc({ ...EMPTY_KYC, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // ---------- Load from server ----------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const merged: BusinessKyc = { ...EMPTY_KYC, ...data };
            if (!Array.isArray(merged.products)) merged.products = [];
            setKyc(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        }
      } catch (e) {
        console.error("Error loading KYC:", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ---------- Helpers ----------
  function update<K extends keyof BusinessKyc>(key: K, value: BusinessKyc[K]) {
    const next = { ...kyc, [key]: value };
    setKyc(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateProduct(index: number, patch: Partial<ProductItem>) {
    const next = [...kyc.products];
    next[index] = { ...next[index], ...patch };
    update("products", next);
  }

  function addProduct() {
    const next = [...kyc.products, makeDefaultProduct(kyc.products.length + 1)];
    update("products", next);
  }

  function removeProduct(index: number) {
    update(
      "products",
      kyc.products.filter((_, i) => i !== index)
    );
  }

  function canGoNext(current: Step): boolean {
    if (current === 0) {
      return (
        kyc.businessName.trim().length > 0 &&
        kyc.shortDescription.trim().length > 0 &&
        kyc.industry.trim().length > 0
      );
    }
    if (current === 1) return true;
    if (current === 2) {
      return (
        kyc.targetAudience.trim().length > 0 &&
        kyc.mainPainPoints.trim().length > 0 &&
        kyc.dreamOutcome.trim().length > 0
      );
    }
    return true;
  }

  // ---------- SAVE ----------
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kyc),
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const parsed = (data as { error?: string } | null) ?? null;
        const friendly =
          parsed?.error ||
          "Something went wrong while saving. Please try again.";
        setErrorMessage(friendly);
        setTimeout(() => setErrorMessage(""), 4000);
        return;
      }

      setSavedMessage("All changes saved ✔");
      setTimeout(() => setSavedMessage(""), 2000);

      // notify shell so sidebar name updates
      window.dispatchEvent(
        new CustomEvent<KycUpdatedDetail>("bbs-kyc-updated", {
          detail: { businessName: kyc.businessName },
        })
      );
    } catch (e) {
      console.error("KYC save error:", e);
      setErrorMessage("Unexpected error. Please try again in a moment.");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="text-xs text-[var(--card-muted-fg)]">
        Loading your business profile…
      </div>
    );
  }

  // Shared classes
  const input =
    "w-full rounded-md border px-3 py-2 text-xs md:text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-fg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-bg)] focus:border-transparent transition";
  const textarea = `${input} min-h-[80px]`;
  const labelClass =
    "text-[11px] font-medium text-[var(--card-muted-fg)] tracking-tight";

  const currentStepLabel = stepLabels[step];
  const currentStepDescription = stepDescriptions[step];

  const hasCoreIdentity =
    kyc.businessName.trim().length > 0 || kyc.industry.trim().length > 0;
  const locationBits = [
    kyc.locationCity?.trim(),
    kyc.locationCountry?.trim(),
  ].filter(Boolean);
  const locationString =
    locationBits.length > 0 ? locationBits.join(", ") : "";

  const completion = calculateCompletion(kyc);

  // ---------- Step contents ----------
  const renderStep = () => {
    switch (step) {
      // PAGE 1 – BASICS
      case 0:
        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                  Brand basics
                </p>
                <p className="text-[11px] text-[var(--card-muted-fg)]">
                  This is how Business Brain Studio will “see” your company
                  across all modules.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={input}
                    value={kyc.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Tagline (optional)</label>
                  <input
                    className={input}
                    placeholder="One-line hook your customers remember"
                    value={kyc.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={textarea}
                  placeholder="What do you sell and who is it for? 1–3 lines is enough."
                  value={kyc.shortDescription}
                  onChange={(e) => update("shortDescription", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                  Category & location
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={input}
                    placeholder="Skincare, Coaching, Clothing…"
                    value={kyc.industry}
                    onChange={(e) => update("industry", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Business Model</label>
                  <select
                    className={input}
                    value={kyc.businessModel}
                    onChange={(e) =>
                      update("businessModel", e.target.value as BusinessModel)
                    }
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="info-product">Info-product</option>
                    <option value="saas">SaaS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Country (optional)</label>
                  <input
                    className={input}
                    value={kyc.locationCountry}
                    onChange={(e) =>
                      update("locationCountry", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>City (optional)</label>
                  <input
                    className={input}
                    value={kyc.locationCity}
                    onChange={(e) => update("locationCity", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Website (optional)</label>
                  <input
                    className={input}
                    placeholder="https://yourbrand.com"
                    value={kyc.websiteUrl}
                    onChange={(e) => update("websiteUrl", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    WhatsApp Number (optional)
                  </label>
                  <input
                    className={input}
                    placeholder="+91…"
                    value={kyc.whatsappNumber}
                    onChange={(e) =>
                      update("whatsappNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Instagram Handle (optional, without @)
                </label>
                <input
                  className={input}
                  placeholder="yourbrand"
                  value={kyc.instagramHandle}
                  onChange={(e) =>
                    update("instagramHandle", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      // PAGE 2 – PRODUCTS
      case 1:
        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                    Offers overview
                  </p>
                  <p className="text-[11px] text-[var(--card-muted-fg)]">
                    Add a few key products or services. You can leave this page
                    empty and still continue.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full border border-[var(--border-color)] text-[var(--card-muted-fg)]">
                  Optional
                </span>
              </div>

              {kyc.products.length === 0 && (
                <p className="text-[11px] text-[var(--card-muted-fg)] italic">
                  Start with your bestseller or flagship offer.
                </p>
              )}

              {kyc.products.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-[var(--border-color)] rounded-lg p-4 space-y-3 bg-[var(--card-bg)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-semibold">
                      Item {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Name</label>
                      <input
                        className={input}
                        value={item.name}
                        onChange={(e) =>
                          updateProduct(index, { name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Price / Range</label>
                      <input
                        className={input}
                        placeholder="₹999 / Starts at ₹1,499"
                        value={item.priceText}
                        onChange={(e) =>
                          updateProduct(index, { priceText: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Short Description</label>
                    <textarea
                      className={textarea}
                      placeholder="What does this product or service do?"
                      value={item.shortDescription}
                      onChange={(e) =>
                        updateProduct(index, {
                          shortDescription: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Category (optional)</label>
                      <input
                        className={input}
                        placeholder="Skincare / Coaching / Clothing / Digital product..."
                        value={item.category || ""}
                        onChange={(e) =>
                          updateProduct(index, { category: e.target.value })
                        }
                      />
                    </div>

                    <label className="flex items-center gap-2 text-[11px] mt-auto">
                      <input
                        type="checkbox"
                        className="rounded border-[var(--input-border)]"
                        checked={item.isBestSeller ?? false}
                        onChange={(e) =>
                          updateProduct(index, {
                            isBestSeller: e.target.checked,
                          })
                        }
                      />
                      Mark as bestseller
                    </label>
                  </div>
                </div>
              ))}

              {kyc.products.length < 5 && (
                <button
                  type="button"
                  onClick={addProduct}
                  className="text-[11px] px-3 py-1.5 rounded-md border border-[var(--border-color)] hover:border-[var(--accent-bg)] hover:text-[var(--accent-bg)] transition"
                >
                  + Add another product/service
                </button>
              )}
            </div>
          </div>
        );

      // PAGE 3 – AUDIENCE & VOICE
      case 2:
        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                  Who you&apos;re talking to
                </p>
                <p className="text-[11px] text-[var(--card-muted-fg)]">
                  These answers shape every caption, reply and campaign.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Target audience <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={textarea}
                  placeholder="Who are you mainly selling to? Age, location, type of buyer…"
                  value={kyc.targetAudience}
                  onChange={(e) => update("targetAudience", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Main pain points (comma or new line separated)
                  <span className="text-red-500"> *</span>
                </label>
                <textarea
                  className={textarea}
                  placeholder="Low sales, time-poor, confused about options, etc."
                  value={kyc.mainPainPoints}
                  onChange={(e) => update("mainPainPoints", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Dream outcome for them
                  <span className="text-red-500"> *</span>
                </label>
                <textarea
                  className={textarea}
                  placeholder="What is the best case scenario your product gives them?"
                  value={kyc.dreamOutcome}
                  onChange={(e) => update("dreamOutcome", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div>
                <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                  Brand voice
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Brand tone (optional)</label>
                  <select
                    className={input}
                    value={kyc.brandTone}
                    onChange={(e) =>
                      update("brandTone", e.target.value as BrandTone)
                    }
                  >
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="luxury">Luxury</option>
                    <option value="playful">Playful</option>
                    <option value="empathetic">Empathetic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Language (optional)</label>
                  <select
                    className={input}
                    value={kyc.languagePreference}
                    onChange={(e) =>
                      update(
                        "languagePreference",
                        e.target.value as LanguagePreference
                      )
                    }
                  >
                    <option value="hinglish">Hinglish</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Writing style (optional)</label>
                  <select
                    className={input}
                    value={kyc.writingStyle}
                    onChange={(e) =>
                      update(
                        "writingStyle",
                        e.target.value as WritingStyle
                      )
                    }
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                    <option value="storytelling">Storytelling</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Emoji usage (optional)</label>
                  <select
                    className={input}
                    value={kyc.emojiPreference}
                    onChange={(e) =>
                      update(
                        "emojiPreference",
                        e.target.value as EmojiPreference
                      )
                    }
                  >
                    <option value="no-emojis">No emojis</option>
                    <option value="few-emojis">Few emojis</option>
                    <option value="emoji-heavy">Emoji heavy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      // PAGE 4 – POLICIES
      case 3:
        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/95 px-4 py-4 md:px-5 md:py-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-[var(--card-muted-fg)] uppercase tracking-[0.14em] mb-1">
                    Policies & links
                  </p>
                  <p className="text-[11px] text-[var(--card-muted-fg)]">
                    Paste a short summary or a direct URL for each policy. All
                    fields are optional.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full border border-[var(--border-color)] text-[var(--card-muted-fg)]">
                  Optional
                </span>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Shipping policy (text or link)
                </label>
                <textarea
                  className={textarea}
                  placeholder='Short summary or URL, e.g. “Ships PAN India in 3–7 days via Bluedart” or https://…/shipping'
                  value={kyc.shippingSummary}
                  onChange={(e) => update("shippingSummary", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Return policy (text or link)
                </label>
                <textarea
                  className={textarea}
                  placeholder='Short summary or URL, e.g. “7-day exchange only” or https://…/returns'
                  value={kyc.returnPolicySummary}
                  onChange={(e) =>
                    update("returnPolicySummary", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Refund policy (text or link)
                </label>
                <textarea
                  className={textarea}
                  placeholder="Short summary or URL to your refund policy page."
                  value={kyc.refundPolicySummary}
                  onChange={(e) =>
                    update("refundPolicySummary", e.target.value)
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Payment methods (text or link)
                  </label>
                  <input
                    className={input}
                    placeholder='Text or URL, e.g. “UPI, cards, netbanking, COD” or link to a payments section.'
                    value={kyc.paymentMethods}
                    onChange={(e) =>
                      update("paymentMethods", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Service hours (text or link)
                  </label>
                  <input
                    className={input}
                    placeholder='Text or URL, e.g. “Mon–Sat, 10am–7pm IST” or a contact page link.'
                    value={kyc.serviceHours}
                    onChange={(e) =>
                      update("serviceHours", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Global content / policy rules (text or link)
                </label>
                <textarea
                  className={textarea}
                  placeholder={`Write rules the AI must always follow OR paste a link to a doc. Example:
- No medical, legal or financial claims.
- No guaranteed income or results.
- Avoid fake scarcity / fake discounts.
- Follow Indian regulations and platform policies.
- Be honest, clear and non-manipulative.`}
                  value={kyc.policyText}
                  onChange={(e) => update("policyText", e.target.value)}
                />
                <p className="text-[10px] text-[var(--card-muted-fg)] mt-1">
                  These act as guardrails for all modules — replies, content,
                  funnels, offers, etc.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  // ---------- FORM WRAPPER ----------
  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Top row: steps + meta */}
      <div className="flex flex-col gap-3 mb-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {stepLabels.map((label, idx) => {
              const active = step === idx;
              const completed = idx < step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(idx as Step)}
                  className={[
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] border transition-colors bg-[var(--card-bg)]/70",
                    active
                      ? "border-[var(--accent-bg)] text-[var(--accent-bg)] font-semibold shadow-sm"
                      : completed
                      ? "border-[var(--accent-bg)] text-[var(--accent-bg)]"
                      : "border-[var(--border-color)] text-[var(--card-muted-fg)] hover:border-[var(--accent-bg)] hover:text-[var(--accent-bg)]",
                  ].join(" ")}
                >
                  <span className="h-4 w-4 flex items-center justify-center rounded-full border border-current text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-[var(--card-muted-fg)]">
            <span>
              Step {step + 1} of 4 · {currentStepLabel}
            </span>

            {/* Completion pill */}
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">
                {completion.percent}% complete
              </span>
              <div className="w-20 h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-bg)] transition-all"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>
            </div>

            {savedMessage && (
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <span>●</span>
                {savedMessage}
              </span>
            )}
            {errorMessage && (
              <span className="inline-flex items-center gap-1 text-red-500">
                <span>●</span>
                {errorMessage}
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[var(--card-muted-fg)]">
          {currentStepDescription}
        </p>

        {hasCoreIdentity && (
          <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] shadow-sm">
            <div className="space-y-0.5">
              <p className="font-medium">
                {kyc.businessName || "Business name not set yet"}
              </p>
              <p className="text-[var(--card-muted-fg)]">
                {kyc.industry || "Industry not set"}
                {locationString && ` • ${locationString}`}
              </p>
            </div>
            <span className="text-[10px] text-[var(--card-muted-fg)]">
              This is the profile used across all modules.
            </span>
          </div>
        )}
      </div>

      {/* Step content */}
      {renderStep()}

      {/* Navigation + Save */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-2">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as Step)}
              className="px-3 py-1.5 rounded-md border border-[var(--border-color)] text-[11px] bg-[var(--card-bg)]/70 hover:border-[var(--accent-bg)] hover:text-[var(--accent-bg)] transition"
            >
              ← Back
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              disabled={!canGoNext(step)}
              onClick={() => setStep((step + 1) as Step)}
              className="px-3 py-1.5 rounded-md bg-[var(--accent-bg)] text-[var(--accent-fg)] text-[11px] font-medium disabled:opacity-60"
            >
              Next →
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[10px] text-[var(--card-muted-fg)]">
            Data is stored in your account and cached locally for faster
            loading.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-[var(--accent-bg)] text-[var(--accent-fg)] text-xs md:text-sm font-semibold disabled:opacity-60 shadow-sm hover:brightness-105 transition"
          >
            {saving ? "Saving…" : "Save KYC"}
          </button>
        </div>
      </div>
    </form>
  );
}
