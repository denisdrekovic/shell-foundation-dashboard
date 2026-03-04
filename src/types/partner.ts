export type PortfolioCategory =
  | "smallholder-farmers"
  | "transporters"
  | "microentrepreneurs";

export interface UpliftBin {
  rangeLabel: string;
  rangeLow: number;
  rangeHigh: number;
  men: number;
  women: number;
  all: number;
}

export interface BenchmarkPoint {
  label: string;
  men: number;
  women: number;
  all: number;
}

export interface QualityOfLifeItem {
  question: string;
  stronglyAgree: number;
  agree: number;
  disagree: number;
  stronglyDisagree: number;
}

export interface ResilienceSlice {
  label: string;
  value: number;
  color: string;
}

export interface PartnerData {
  id: string;
  name: string;
  portfolio: PortfolioCategory;
  country: string;
  asset: string;
  sampleSize: number;

  incomeUplift: {
    bins: UpliftBin[];
    stats: {
      mean: number;
      median: number;
    };
  };

  incomeBenchmarks: {
    baseline: BenchmarkPoint;
    endline: BenchmarkPoint;
    referenceLines: {
      worldBankInternational: number;
      worldBankCountry: number;
      livingWage: number;
    };
  };

  qualityOfLife: QualityOfLifeItem[];
  resilience: ResilienceSlice[];
}
