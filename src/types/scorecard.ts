import { PortfolioCategory } from "./partner";

export interface ScorecardRow {
  evaluationPartner: string;
  portfolio: PortfolioCategory;
  partner: string;
  country: string;
  asset: string;
  sampleSize: number;
  meanUplift: number | null;
  medianUplift: number | null;
  proportionAbove20: number | null;
  note?: string;
}

export interface ROIRow {
  portfolio: PortfolioCategory;
  partner: string;
  country: string;
  intervention: string;
  avgNetIncomeUpliftPerClient: number;
  cumulativeClientTotal: number;
  cumulativeInvestment: number;
  cumulativeROI: number;
}
