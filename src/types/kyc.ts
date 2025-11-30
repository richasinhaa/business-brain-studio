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
  // PAGE 1 – BASICS
  businessName: string;
  tagline: string;
  shortDescription: string;
  industry: string;
  businessModel: BusinessModel;
  locationCity: string;
  locationCountry: string;
  websiteUrl?: string;
  whatsappNumber?: string;
  instagramHandle?: string;

   // PAGE 2 – PRODUCTS & PRICING (OPTIONAL)
  products: ProductItem[];


  // PAGE 3 – AUDIENCE & VOICE
  targetAudience: string;
  mainPainPoints: string; // free text; one per line or comma-separated
  dreamOutcome: string;
  brandTone: BrandTone;
  languagePreference: LanguagePreference;
  writingStyle: WritingStyle;
  emojiPreference: EmojiPreference;

  // PAGE 4 – POLICIES (OPTIONAL)
  shippingSummary?: string;
  returnPolicySummary?: string;
  refundPolicySummary?: string;
  paymentMethods?: string; // free text, e.g. "UPI, cards, COD"
  serviceHours?: string;

  // Extras (optional for later use)
  testimonials?: {
    customerFirstName?: string;
    quote: string;
  }[];
  faqItems?: {
    question: string;
    answer: string;
  }[];
}
