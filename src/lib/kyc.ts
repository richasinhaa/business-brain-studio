// src/lib/kyc.ts
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BusinessKyc } from "@/types/kyc";

/**
 * Load the saved Business KYC for the currently logged-in user.
 * Returns null if no user or no KYC is found.
 */
export async function getCurrentUserKyc(): Promise<BusinessKyc | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const userId = (user as { id?: string | null }).id ?? null;
  if (!userId) return null;

  const record = await db.businessKyc.findFirst({
    where: { userId },
  });

  // Cast JSON → unknown → BusinessKyc
  return (record?.data as unknown as BusinessKyc) ?? null;
}

/** Backwards-compatible alias for old imports */
export async function getKycForCurrentUser(): Promise<BusinessKyc | null> {
  return getCurrentUserKyc();
}

/** Fetch KYC by explicit userId */
export async function getKycByUserId(
  userId: string
): Promise<BusinessKyc | null> {
  const record = await db.businessKyc.findFirst({
    where: { userId },
  });

  return (record?.data as unknown as BusinessKyc) ?? null;
}

/** Turn BusinessKyc → readable string for AI prompt */
export function stringifyKyc(kyc: BusinessKyc | null): string {
  if (!kyc) {
    return "Business profile unavailable. Ask user to complete Business KYC.";
  }

  const parts: string[] = [];

  parts.push(
    `Business name: ${kyc.businessName || "N/A"}`,
    `Tagline: ${kyc.tagline || "N/A"}`,
    `Short description: ${kyc.shortDescription || "N/A"}`,
    `Industry: ${kyc.industry || "N/A"}`,
    `Business model: ${kyc.businessModel || "N/A"}`
  );

  const location = [kyc.locationCity, kyc.locationCountry]
    .filter(Boolean)
    .join(", ");
  if (location) parts.push(`Location: ${location}`);

  parts.push(
    `Website: ${kyc.websiteUrl || "N/A"}`,
    `WhatsApp: ${kyc.whatsappNumber || "N/A"}`,
    `Instagram: ${kyc.instagramHandle || "N/A"}`
  );

  if (Array.isArray(kyc.products) && kyc.products.length > 0) {
    parts.push("Key offers:");
    for (const [i, p] of kyc.products.entries()) {
      parts.push(
        `  - Offer ${i + 1}: ${[
          p.name && `Name: ${p.name}`,
          p.priceText && `Price: ${p.priceText}`,
          p.shortDescription && `Desc: ${p.shortDescription}`,
          p.category && `Category: ${p.category}`,
          p.isBestSeller ? "Bestseller: yes" : "",
        ]
          .filter(Boolean)
          .join(" | ")}`
      );
    }
  }

  parts.push(
    `Target audience: ${kyc.targetAudience || "N/A"}`,
    `Pain points: ${kyc.mainPainPoints || "N/A"}`,
    `Dream outcome: ${kyc.dreamOutcome || "N/A"}`,
    `Brand tone: ${kyc.brandTone || "N/A"}`,
    `Language preference: ${kyc.languagePreference || "N/A"}`,
    `Writing style: ${kyc.writingStyle || "N/A"}`,
    `Emoji preference: ${kyc.emojiPreference || "N/A"}`
  );

  if (kyc.shippingSummary) parts.push(`Shipping: ${kyc.shippingSummary}`);
  if (kyc.returnPolicySummary) parts.push(`Returns: ${kyc.returnPolicySummary}`);
  if (kyc.refundPolicySummary) parts.push(`Refunds: ${kyc.refundPolicySummary}`);
  if (kyc.paymentMethods) parts.push(`Payment methods: ${kyc.paymentMethods}`);
  if (kyc.serviceHours) parts.push(`Service hours: ${kyc.serviceHours}`);
  if (kyc.policyText) parts.push(`Content rules: ${kyc.policyText}`);
  if (kyc.policyUrl) parts.push(`Policy URL: ${kyc.policyUrl}`);

  return parts.join("\n");
}
