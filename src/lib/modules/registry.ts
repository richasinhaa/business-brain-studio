import type { ModuleConfig } from "@/types/modules";

export const MODULES: ModuleConfig[] = [
  {
    id: "reply-assistant",
    name: "Customer Reply Assistant",
    description: "Generate perfect customer replies based on your business profile.",
    icon: "💬",
    route: "/modules/reply-assistant",
  },
  {
    id: "website-content",
    name: "Website Content Studio",
    description: "Homepage copy, about section, and more.",
    icon: "🖥️",
    route: "/modules/website-content",
  },
  {
    id: "whatsapp-broadcast",
    name: "WhatsApp Broadcast Generator",
    description: "Campaign messages for offers and launches.",
    icon: "📢",
    route: "/modules/whatsapp-broadcast",
  },
  {
    id: "instagram-captions",
    name: "Instagram Caption Studio",
    description: "Scroll-stopping captions tailored to your brand.",
    icon: "📸",
    route: "/modules/instagram-captions",
  },
  {
    id: "product-descriptions",
    name: "Product Description Maker",
    description: "SEO-friendly, convincing product descriptions.",
    icon: "🛒",
    route: "/modules/product-descriptions",
  },
  {
    id: "sales-scripts",
    name: "Sales Script Writer",
    description: "DM and call scripts that convert.",
    icon: "🔥",
    route: "/modules/sales-scripts",
  },
  {
    id: "review-requests",
    name: "Review Request Messages",
    description: "Polite, effective review request templates.",
    icon: "⭐",
    route: "/modules/review-requests",
  },
  {
    id: "about-bio",
    name: "About & Bio Writer",
    description: "Bios for WhatsApp, Instagram, and your site.",
    icon: "👤",
    route: "/modules/about-bio",
  },
];

export const getModuleById = (id: string) =>
  MODULES.find((m) => m.id === id);
