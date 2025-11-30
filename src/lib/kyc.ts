import { BusinessKyc } from "@/types/kyc";
import { db } from "./db";
import { getCurrentUser } from "./auth";

export async function getKycForCurrentUser(): Promise<BusinessKyc | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const record = await db.businessKyc.findFirst({
    where: { userId: user.id },
  });

  return (record?.data as BusinessKyc) ?? null;
}

export function stringifyKyc(kyc: BusinessKyc | null): string {
  if (!kyc) return "";
  return JSON.stringify(kyc, null, 2);
}
