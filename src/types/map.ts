import { PartnerData, PortfolioCategory } from "./partner";

export interface GeoLocation {
  partnerId: string;
  partnerName: string;
  portfolio: PortfolioCategory;
  country: string;
  coordinates: [number, number]; // [lng, lat]
  sampleSize: number;
}

export interface EnrichedGeoLocation extends GeoLocation {
  endlineIncome: {
    all: number;
    men: number;
    women: number;
  };
  baselineIncome: {
    all: number;
    men: number;
    women: number;
  };
  livingWage: number;
  incomeToWageRatio: number; // endline all / living wage (0 to 1+)
  incomeUpliftPercent: number | null; // median uplift %
  asset: string;
  qualityOfLifeScore: number; // % "agree" + "strongly agree" across questions
  resiliencePositive: number; // % "without difficulty" + "with some difficulty"
}

export interface CountryPartnerGroup {
  country: string;
  coordinates: [number, number]; // average coords for the country
  partners: EnrichedGeoLocation[];
  avgIncomeToWageRatio: number;
  totalSampleSize: number;
}
