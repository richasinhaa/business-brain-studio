// src/types/kyc.ts

export type BusinessModel =
  | "product"
  | "service"
  | "hybrid"
  | "info-product"
  | "saas";

export type BrandTone =
  | "friendly"
  | "formal"
  | "luxury"
  | "playful"
  | "empathetic";

export type LanguagePreference = "hinglish" | "english" | "hindi";

export type WritingStyle = "short" | "medium" | "long" | "storytelling";

export type EmojiPreference = "no-emojis" | "few-emojis" | "emoji-heavy";

export interface ProductItem {
  id: string;
  name: string;
  shortDescription: string;
  priceText: string;
  category?: string;
  isBestSeller?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name?: string;
  role?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BusinessKyc {
  // Basics
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

  // Products
  products: ProductItem[];

  // Audience & Voice
  targetAudience: string;
  mainPainPoints: string;
  dreamOutcome: string;
  brandTone: BrandTone;
  languagePreference: LanguagePreference;
  writingStyle: WritingStyle;
  emojiPreference: EmojiPreference;

  // Policies & guardrails
  shippingSummary: string;
  returnPolicySummary: string;
  refundPolicySummary: string;
  paymentMethods: string;
  serviceHours: string;
  policyText: string;
  policyUrl: string;

  // Extras
  testimonials: Testimonial[];
  faqItems: FaqItem[];
}
