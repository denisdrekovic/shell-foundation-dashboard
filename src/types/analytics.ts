import { PortfolioCategory } from "@/types/partner";

// ── Actor-specific input types ──

export interface FarmerInputs {
  productivityChange: number; // -50 to +100 (%)
  cropType: "rice" | "wheat" | "maize" | "coffee" | "vegetables";
  cropYieldChange: number; // -50 to +100 (%)
  cropPricePerUnit: number; // $/kg (0.1 to 5.0)
  farmSizeHectares: number; // 0.5 to 10
}

export interface TransporterInputs {
  tripsPerDay: number; // 1 to 20
  revenuePerTrip: number; // $1 to $50
  fuelCostChange: number; // -50 to +100 (%)
  vehicleUtilization: number; // 20 to 100 (% of capacity)
  fleetSize: number; // 1 to 10
}

export interface MicroentrepreneurInputs {
  customersPerDay: number; // 5 to 100
  avgTransactionValue: number; // $0.50 to $20
  operatingCostChange: number; // -50 to +100 (%)
  productDiversification: number; // 1 to 5 product lines
  marketAccessChange: number; // -50 to +100 (%)
}

export interface PredictiveInputs {
  actorType: PortfolioCategory;
  country: Country;
  numBeneficiaries: number; // 100 to 2000
  farmer: FarmerInputs;
  transporter: TransporterInputs;
  microentrepreneur: MicroentrepreneurInputs;
}

// ── Output types (shared across all actor types) ──

export interface IncomeTrajectoryPoint {
  month: number;
  baseline: number;
  projected: number;
}

export interface PovertyDistribution {
  label: string;
  belowExtremePoverty: number;
  belowPovertyLine: number;
  belowLivingWage: number;
  aboveLivingWage: number;
}

export interface WaterfallSegment {
  name: string;
  start: number;
  end: number;
  value: number;
  fill: string;
}

export interface SensitivityRow {
  driver: string;
  elasticity: number;
  currentImpact: number;
  direction: "positive" | "negative";
}

export interface CountryProjection {
  country: string;
  baseline: number;
  projected: number;
  livingWage: number;
  gap: number;
  partners: string[];
}

// ── Configs ──

export const CROP_CONFIGS: Record<
  FarmerInputs["cropType"],
  { label: string; baseYieldPerHa: number; basePricePerUnit: number }
> = {
  rice: { label: "Rice", baseYieldPerHa: 3.5, basePricePerUnit: 0.35 },
  wheat: { label: "Wheat", baseYieldPerHa: 3.0, basePricePerUnit: 0.3 },
  maize: { label: "Maize", baseYieldPerHa: 2.5, basePricePerUnit: 0.25 },
  coffee: { label: "Coffee", baseYieldPerHa: 1.2, basePricePerUnit: 3.5 },
  vegetables: { label: "Vegetables", baseYieldPerHa: 8.0, basePricePerUnit: 0.5 },
};

// ── Default values ──

export const DEFAULT_FARMER_INPUTS: FarmerInputs = {
  productivityChange: 0,
  cropType: "rice",
  cropYieldChange: 0,
  cropPricePerUnit: 0.35,
  farmSizeHectares: 2.0,
};

export const DEFAULT_TRANSPORTER_INPUTS: TransporterInputs = {
  tripsPerDay: 6,
  revenuePerTrip: 8.0,
  fuelCostChange: 0,
  vehicleUtilization: 60,
  fleetSize: 1,
};

export const DEFAULT_MICROENTREPRENEUR_INPUTS: MicroentrepreneurInputs = {
  customersPerDay: 20,
  avgTransactionValue: 2.5,
  operatingCostChange: 0,
  productDiversification: 2,
  marketAccessChange: 0,
};

export const DEFAULT_INPUTS: PredictiveInputs = {
  actorType: "smallholder-farmers",
  country: "all",
  numBeneficiaries: 500,
  farmer: DEFAULT_FARMER_INPUTS,
  transporter: DEFAULT_TRANSPORTER_INPUTS,
  microentrepreneur: DEFAULT_MICROENTREPRENEUR_INPUTS,
};

// ── Country config ──

export type Country = "all" | "India" | "Kenya" | "Rwanda" | "Nigeria";

export interface CountryConfig {
  label: string;
  livingWage: number;
  /** Which actor types have partners in this country */
  actorTypes: PortfolioCategory[];
  /** Baseline incomes per actor type in this country (from partner survey data) */
  baselinesByActor: Partial<Record<PortfolioCategory, number>>;
  partners: string[];
}

export const COUNTRY_CONFIG: Record<Country, CountryConfig> = {
  all: {
    label: "All Countries (Portfolio Avg)",
    livingWage: 7.5,
    actorTypes: ["smallholder-farmers", "transporters", "microentrepreneurs"],
    baselinesByActor: {
      "smallholder-farmers": 4.25,
      transporters: 5.1,
      microentrepreneurs: 3.8,
    },
    partners: [],
  },
  India: {
    label: "India",
    livingWage: 7.2,
    actorTypes: ["smallholder-farmers", "transporters"],
    baselinesByActor: {
      "smallholder-farmers": 3.8, // weighted avg of Sistema.bio 5.10 (n=532) + S4S 2.50 (n=355)
      transporters: 5.0, // SIDBI
    },
    partners: ["Sistema.bio", "S4S", "SIDBI"],
  },
  Kenya: {
    label: "Kenya",
    livingWage: 8.5,
    actorTypes: ["smallholder-farmers", "transporters", "microentrepreneurs"],
    baselinesByActor: {
      "smallholder-farmers": 3.0, // Sunculture
      transporters: 6.5, // M-KOPA
      microentrepreneurs: 5.5, // Keep IT Cool
    },
    partners: ["Sunculture", "M-KOPA", "Keep IT Cool"],
  },
  Rwanda: {
    label: "Rwanda",
    livingWage: 6.8,
    actorTypes: ["transporters"],
    baselinesByActor: {
      transporters: 4.0, // Ampersand Rwanda
    },
    partners: ["Ampersand Rwanda"],
  },
  Nigeria: {
    label: "Nigeria",
    livingWage: 6.5,
    actorTypes: ["microentrepreneurs"],
    baselinesByActor: {
      microentrepreneurs: 3.0, // Odyssey
    },
    partners: ["Odyssey"],
  },
};

// ── Actor type display config ──

export const ACTOR_TYPE_CONFIG: Record<
  PortfolioCategory,
  { label: string; description: string; color: string; baselineIncome: number }
> = {
  "smallholder-farmers": {
    label: "Smallholder Farmers",
    description: "Explore crop yield, pricing, and farm productivity scenarios",
    color: "#00A17D",
    baselineIncome: 4.25,
  },
  transporters: {
    label: "Transporters",
    description: "Model trip volume, route revenue, and fleet efficiency scenarios",
    color: "#910D63",
    baselineIncome: 5.1,
  },
  microentrepreneurs: {
    label: "Microentrepreneurs",
    description: "Adjust customer volume, transaction value, and market access scenarios",
    color: "#2A1055",
    baselineIncome: 3.8,
  },
};
