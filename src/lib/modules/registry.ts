// src/lib/modules/registry.ts
import type { ComponentType } from "react";
import {
  MessageCircle,
  FileText,
  Megaphone,
  Image,
  Tag,
  PhoneCall,
  Star,
  User2,
} from "lucide-react";

export type ModuleDef = {
  id: string;
  name: string;
  description: string;
  route: string;
  // icon is a React component (Lucide)
  icon: ComponentType<{ className?: string }>;
};

export const MODULES: ModuleDef[] = [
  {
    id: "customer-reply",
    name: "Customer Reply Assistant",
    description:
      "Generate perfect customer replies based on your business profile.",
    route: "/modules/customer-reply",
    icon: MessageCircle,
  },
  {
    id: "website-content",
    name: "Website Content Studio",
    description: "Homepage copy, about section, and more.",
    route: "/modules/website-content",
    icon: FileText,
  },
  {
    id: "whatsapp-broadcast",
    name: "WhatsApp Broadcast Generator",
    description: "Campaign messages for offers and launches.",
    route: "/modules/whatsapp-broadcast",
    icon: Megaphone,
  },
  {
    id: "instagram-caption",
    name: "Instagram Caption Studio",
    description: "Scroll-stopping captions tailored to your brand.",
    route: "/modules/instagram-captions",
    icon: Image,
  },
  {
    id: "product-description",
    name: "Product Description Maker",
    description: "SEO-friendly, convincing product descriptions.",
    route: "/modules/product-descriptions",
    icon: Tag,
  },
  {
    id: "sales-script",
    name: "Sales Script Writer",
    description: "DM and call scripts that convert.",
    route: "/modules/sales-scripts",
    icon: PhoneCall,
  },
  {
    id: "review-request",
    name: "Review Request Messages",
    description: "Polite, effective review request templates.",
    route: "/modules/review-requests",
    icon: Star,
  },
  {
    id: "about-bio",
    name: "About & Bio Writer",
    description: "Bios for WhatsApp, Instagram, and your site.",
    route: "/modules/about-bio",
    icon: User2,
  },
];
