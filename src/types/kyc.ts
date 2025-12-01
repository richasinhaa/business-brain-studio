// src/types/kyc.ts

export type BrandTone =
  | "friendly"
  | "formal"
  | "luxury"
  | "playful"
  | "empathetic";

export type LanguagePreference = "english" | "hindi" | "hinglish";

export type WritingStyle = "short" | "medium" | "long" | "storytelling";

export type EmojiPreference = "no-emojis" | "few-emojis" | "emoji-heavy";

export type BusinessModel =
  | "product"
  | "service"
  | "hybrid"
  | "info-product"
  | "saas";

export interface ProductItem {
  id: string;
  name: string;
  shortDescription: string;
  priceText: string; // "₹999" or "Starts at ₹1,499"
  category?: string;
  isBestSeller?: boolean;
}


export interface BusinessKyc {
  // --- Page 1 – Basics ---
  businessName: string;
  tagline: string;
  shortDescription: string;
  industry: string;
  businessModel: BusinessModel;
  locationCity: string;
  locationCountry: string;
  websiteUrl: string;
  whatsappNumber: string;
  instagramHandle: string;

  // --- Page 2 – Products ---
  products: ProductItem[];

  // --- Page 3 – Audience & Voice ---
  targetAudience: string;
  mainPainPoints: string;
  dreamOutcome: string;
  brandTone: BrandTone;
  languagePreference: LanguagePreference;
  writingStyle: WritingStyle;
  emojiPreference: EmojiPreference;

  // --- Page 4 – Policies & guardrails ---
  shippingSummary: string;
  returnPolicySummary: string;
  refundPolicySummary: string;
  paymentMethods: string;
  serviceHours: string;

  // 🔴 These two are missing and causing all the TS errors:
  policyText: string;   // global content / policy rules text
  policyUrl: string;    // optional link to a policy doc

  // --- Extras (whatever you already had) ---
  testimonials: any[];
  faqItems: any[];
}

