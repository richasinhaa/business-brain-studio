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
  "Products & Pricing (optional)",
  "Audience & Voice",
  "Policies (optional)",
];

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

  // Page 2 – Products (optional)
  products: [],

  // Page 3 – Audience & Voice
  targetAudience: "",
  mainPainPoints: "",
  dreamOutcome: "",
  brandTone: "friendly",
  languagePreference: "hinglish",
  writingStyle: "short",
  emojiPreference: "few-emojis",

  // Page 4 – Policies (optional)
  shippingSummary: "",
  returnPolicySummary: "",
  refundPolicySummary: "",
  paymentMethods: "",
  serviceHours: "",

  // 🔒 Global policy guardrails
  policyText: "",
  policyUrl: "",

  testimonials: [],
  faqItems: [],
};

export default function KycForm() {
  const [kyc, setKyc] = useState<BusinessKyc>(EMPTY_KYC);
  const [step, setStep] = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // ---------- Load from localStorage first (fast) ----------
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setKyc({ ...EMPTY_KYC, ...parsed });
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  // ---------- Then load from server (Prisma/Supabase) ----------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/kyc");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const merged: BusinessKyc = { ...EMPTY_KYC, ...data };
            if (!Array.isArray(merged.products)) {
              merged.products = [];
            }
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
    const next = [
      ...kyc.products,
      makeDefaultProduct(kyc.products.length + 1),
    ];
    update("products", next);
  }

  function removeProduct(index: number) {
    const next = kyc.products.filter((_, i) => i !== index);
    update("products", next);
  }

  function canGoNext(current: Step): boolean {
    // Step 0: basics required
    if (current === 0) {
      return (
        kyc.businessName.trim().length > 0 &&
        kyc.shortDescription.trim().length > 0 &&
        kyc.industry.trim().length > 0
      );
    }
    // Step 1: products optional → always OK
    if (current === 1) {
      return true;
    }
    // Step 2: audience & voice basic requirements
    if (current === 2) {
      return (
        kyc.targetAudience.trim().length > 0 &&
        kyc.mainPainPoints.trim().length > 0 &&
        kyc.dreamOutcome.trim().length > 0
      );
    }
    return true;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/kyc", {
        method: "POST",
        body: JSON.stringify(kyc),
      });
      setSavedMessage("Saved!");
      setTimeout(() => setSavedMessage(""), 1500);
    } catch (e) {
      console.error("Error saving KYC:", e);
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

  const input =
    "w-full rounded border px-3 py-2 text-xs md:text-sm bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-bg)]";
  const textarea = `${input} min-h-[80px]`;
  const labelClass = "text-xs font-medium text-[var(--card-muted-fg)]";

  // ---------- Step contents ----------
  const renderStep = () => {
    switch (step) {
      // PAGE 1 – BASICS
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Business Name</label>
                <input
                  className={input}
                  value={kyc.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Tagline</label>
                <input
                  className={input}
                  placeholder="One-line hook"
                  value={kyc.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Short Description</label>
              <textarea
                className={textarea}
                value={kyc.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Industry</label>
                <input
                  className={input}
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
                <label className={labelClass}>Country</label>
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
                <label className={labelClass}>City</label>
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
                  value={kyc.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>WhatsApp Number (optional)</label>
                <input
                  className={input}
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
                value={kyc.instagramHandle}
                onChange={(e) =>
                  update("instagramHandle", e.target.value)
                }
              />
            </div>
          </div>
        );

      // PAGE 2 – PRODUCTS & PRICING (OPTIONAL)
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-xs text-[var(--card-muted-fg)]">
              Add some key products or services with pricing. This step is
              optional but helps generate more accurate replies and sales copy.
            </p>

            {kyc.products.map((item, index) => (
              <div
                key={item.id}
                className="border border-[var(--card-border)] rounded-lg p-4 space-y-3 bg-[var(--page-bg)]/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold">
                    Item {index + 1}
                  </h3>
                  {kyc.products.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-[10px] text-red-500"
                    >
                      Remove
                    </button>
                  )}
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
                className="text-[11px] px-3 py-1 rounded border border-[var(--card-border)] hover:border-[var(--accent-bg)]"
              >
                + Add another product/service
              </button>
            )}

            {kyc.products.length === 0 && (
              <p className="text-[11px] text-[var(--card-muted-fg)]">
                You can skip this step if you don&apos;t want to add products now.
              </p>
            )}
          </div>
        );

      // PAGE 3 – AUDIENCE & VOICE
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Target audience</label>
              <textarea
                className={textarea}
                placeholder="Who are you mainly selling to?"
                value={kyc.targetAudience}
                onChange={(e) =>
                  update("targetAudience", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Main pain points (comma or new line separated)
              </label>
              <textarea
                className={textarea}
                value={kyc.mainPainPoints}
                onChange={(e) =>
                  update("mainPainPoints", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Dream outcome for them</label>
              <textarea
                className={textarea}
                value={kyc.dreamOutcome}
                onChange={(e) =>
                  update("dreamOutcome", e.target.value)
                }
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Brand tone</label>
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
                <label className={labelClass}>Language</label>
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
                <label className={labelClass}>Writing style</label>
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
                <label className={labelClass}>Emoji usage</label>
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
        );

      // PAGE 4 – POLICIES (OPTIONAL)
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xs text-[var(--card-muted-fg)]">
              These are optional, but extremely useful for accurate customer
              replies about shipping, returns, refunds and payments.
            </p>

            <div className="space-y-1.5">
              <label className={labelClass}>Shipping summary</label>
              <textarea
                className={textarea}
                placeholder="We ship PAN India within 3–7 working days via…"
                value={kyc.shippingSummary}
                onChange={(e) =>
                  update("shippingSummary", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Return policy summary</label>
              <textarea
                className={textarea}
                placeholder="7-day exchange only for unused products…"
                value={kyc.returnPolicySummary}
                onChange={(e) =>
                  update("returnPolicySummary", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Refund policy summary</label>
              <textarea
                className={textarea}
                value={kyc.refundPolicySummary}
                onChange={(e) =>
                  update("refundPolicySummary", e.target.value)
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Payment methods</label>
                <input
                  className={input}
                  placeholder="UPI, cards, netbanking, COD…"
                  value={kyc.paymentMethods}
                  onChange={(e) =>
                    update("paymentMethods", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Service hours</label>
                <input
                  className={input}
                  placeholder="Mon–Sat, 10am–7pm IST"
                  value={kyc.serviceHours}
                  onChange={(e) =>
                    update("serviceHours", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 🔒 Global guardrail policy text */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Global content / policy rules (guardrails)
              </label>
              <textarea
                className={textarea}
                placeholder={`Write rules that the AI must always follow. Example:
- Do not make medical, legal or financial claims.
- Do not promise guaranteed income or results.
- Avoid fake scarcity / fake discounts.
- Follow Indian regulations and platform policies.
- Be honest, clear and non-manipulative.`}
                value={kyc.policyText}
                onChange={(e) => update("policyText", e.target.value)}
              />
              <p className="text-[10px] text-[var(--card-muted-fg)] mt-1">
                This will be treated as hard guardrails whenever Business Brain
                Studio suggests or creates anything (content, replies, funnels,
                offers, etc.).
              </p>
            </div>

            {/* 🔗 Policy URL */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Policy URL (optional)
              </label>
              <input
                className={input}
                placeholder="Link to your full policy / T&C / refund page…"
                value={kyc.policyUrl}
                onChange={(e) => update("policyUrl", e.target.value)}
              />
            </div>
          </div>
        );
    }
  };

  // ---------- Render ----------
  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 border border-[var(--card-border)] rounded-2xl p-5 md:p-6 bg-[var(--card-bg)] shadow-sm"
    >
      {/* Step chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {stepLabels.map((label, idx) => {
          const active = step === idx;
          const completed = idx < step;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(idx as Step)}
              className={[
                "px-3 py-1 rounded-full text-[11px] border",
                active
                  ? "border-[var(--accent-bg)] bg-[var(--accent-soft-bg)] text-[var(--accent-bg)] font-semibold"
                  : completed
                  ? "border-[var(--accent-bg)] text-[var(--accent-bg)]"
                  : "border-[var(--card-border)] text-[var(--card-muted-fg)]",
              ].join(" ")}
            >
              {idx + 1}. {label}
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {renderStep()}

      {/* Navigation + Save */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)] mt-4">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(((step - 1) as Step))}
              className="px-3 py-1.5 rounded border border-[var(--card-border)] text-[11px]"
            >
              ← Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              disabled={!canGoNext(step)}
              onClick={() => setStep(((step + 1) as Step))}
              className="px-3 py-1.5 rounded bg-[var(--accent-bg)] text-[var(--accent-fg)] text-[11px] disabled:opacity-60"
            >
              Next →
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-[var(--accent-bg)] text-[var(--accent-fg)] text-xs md:text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save KYC"}
          </button>
          {savedMessage && (
            <span className="text-[11px] text-emerald-500">
              {savedMessage}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
