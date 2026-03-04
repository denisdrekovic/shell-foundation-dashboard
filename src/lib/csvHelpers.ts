import {
  UpliftBin,
  BenchmarkPoint,
  ResilienceSlice,
  QualityOfLifeItem,
} from "@/types/partner";
import {
  IncomeTrajectoryPoint,
  PovertyDistribution,
  WaterfallSegment,
  CountryProjection,
  SensitivityRow,
} from "@/types/analytics";

type CsvRow = Record<string, string | number>;

/** Generic CSV download — creates and triggers a .csv file download. */
export function downloadCSV(data: CsvRow[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const str = String(row[h] ?? "");
      return str.includes(",") || str.includes('"')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    })
  );
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Per-chart data preparation functions ──

export function prepareUpliftCSV(bins: UpliftBin[]): CsvRow[] {
  return bins.map((b) => ({
    Range: b.rangeLabel,
    "Range Low (%)": b.rangeLow,
    "Range High (%)": b.rangeHigh,
    All: b.all,
    Men: b.men,
    Women: b.women,
  }));
}

export function prepareBenchmarksCSV(
  baseline: BenchmarkPoint,
  endline: BenchmarkPoint,
  referenceLines: { worldBankInternational: number; worldBankCountry: number; livingWage: number }
): CsvRow[] {
  return [
    {
      Period: "Baseline",
      "All ($/day)": baseline.all,
      "Men ($/day)": baseline.men,
      "Women ($/day)": baseline.women,
    },
    {
      Period: "Endline",
      "All ($/day)": endline.all,
      "Men ($/day)": endline.men,
      "Women ($/day)": endline.women,
    },
    {
      Period: "Reference: Extreme Poverty",
      "All ($/day)": referenceLines.worldBankInternational,
      "Men ($/day)": "",
      "Women ($/day)": "",
    },
    {
      Period: "Reference: Poverty Line",
      "All ($/day)": referenceLines.worldBankCountry,
      "Men ($/day)": "",
      "Women ($/day)": "",
    },
    {
      Period: "Reference: Living Wage",
      "All ($/day)": referenceLines.livingWage,
      "Men ($/day)": "",
      "Women ($/day)": "",
    },
  ];
}

export function prepareResilienceCSV(slices: ResilienceSlice[]): CsvRow[] {
  return slices.map((s) => ({
    Response: s.label,
    "Percentage (%)": s.value,
  }));
}

export function prepareQualityOfLifeCSV(items: QualityOfLifeItem[]): CsvRow[] {
  return items.map((item) => ({
    Question: item.question,
    "Strongly Agree (%)": item.stronglyAgree,
    "Agree (%)": item.agree,
    "Disagree (%)": item.disagree,
    "Strongly Disagree (%)": item.stronglyDisagree,
  }));
}

export function prepareProjectedIncomeCSV(
  data: IncomeTrajectoryPoint[]
): CsvRow[] {
  return data.map((d) => ({
    Month: d.month,
    "Baseline ($/day)": Number(d.baseline.toFixed(2)),
    "Projected ($/day)": Number(d.projected.toFixed(2)),
  }));
}

export function preparePovertyCSV(data: PovertyDistribution[]): CsvRow[] {
  return data.map((d) => ({
    Scenario: d.label,
    "Below Extreme Poverty": d.belowExtremePoverty,
    "Below Poverty Line": d.belowPovertyLine,
    "Below Living Wage": d.belowLivingWage,
    "Above Living Wage": d.aboveLivingWage,
  }));
}

export function prepareWaterfallCSV(data: WaterfallSegment[]): CsvRow[] {
  return data.map((d) => ({
    Segment: d.name,
    "Value ($/day)": Number(d.value.toFixed(2)),
    "Start ($/day)": Number(d.start.toFixed(2)),
    "End ($/day)": Number(d.end.toFixed(2)),
  }));
}

export function prepareCountryCompCSV(data: CountryProjection[]): CsvRow[] {
  return data.map((d) => ({
    Country: d.country,
    "Baseline ($/day)": Number(d.baseline.toFixed(2)),
    "Projected ($/day)": Number(d.projected.toFixed(2)),
    "Living Wage ($/day)": Number(d.livingWage.toFixed(2)),
    "Gap ($/day)": Number(d.gap.toFixed(2)),
    Partners: d.partners.join("; "),
  }));
}

export function prepareSensitivityCSV(data: SensitivityRow[]): CsvRow[] {
  return data.map((d) => ({
    Driver: d.driver,
    Elasticity: Number(d.elasticity.toFixed(3)),
    "Current Impact ($/day)": Number(d.currentImpact.toFixed(2)),
    Direction: d.direction,
  }));
}

export function prepareGroupCompCSV(
  groups: { name: string; avgIncome: number; avgRatio: number; count: number }[]
): CsvRow[] {
  return groups.map((g) => ({
    Group: g.name,
    "Avg Income ($/day)": Number(g.avgIncome.toFixed(2)),
    "Living Wage Progress (%)": Number(g.avgRatio.toFixed(0)),
    "Partner Count": g.count,
  }));
}
