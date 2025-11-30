export type ModuleId =
  | "reply-assistant"
  | "website-content"
  | "whatsapp-broadcast"
  | "instagram-captions"
  | "product-descriptions"
  | "sales-scripts"
  | "review-requests"
  | "about-bio";

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  icon?: string;
  route: string;
}
