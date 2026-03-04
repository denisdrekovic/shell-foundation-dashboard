import { PortfolioCategory } from "@/types/partner";

export interface PartnerGroup {
  label: string;
  route: string;
  partners: string[];
}

export const PARTNER_GROUPS: Record<PortfolioCategory, PartnerGroup> = {
  "smallholder-farmers": {
    label: "Smallholder Farmers",
    route: "/smallholder-farmers",
    partners: ["sistema-bio", "s4s", "sunculture"],
  },
  transporters: {
    label: "Transporters",
    route: "/transporters",
    partners: ["ampersand-rwanda", "m-kopa", "sidbi"],
  },
  microentrepreneurs: {
    label: "Microentrepreneurs",
    route: "/microentrepreneurs",
    partners: ["keep-it-cool", "odyssey"],
  },
};

export const PARTNER_NAMES: Record<string, string> = {
  "sistema-bio": "Sistema.bio",
  s4s: "S4S",
  sunculture: "Sunculture",
  "ampersand-rwanda": "Ampersand Rwanda",
  "m-kopa": "M-KOPA",
  sidbi: "SIDBI",
  "keep-it-cool": "Keep IT Cool",
  odyssey: "Odyssey",
};
