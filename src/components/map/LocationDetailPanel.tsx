"use client";

import { EnrichedGeoLocation } from "@/types/map";
import { getPartnerById } from "@/lib/dataAggregation";
import { incomeToColor } from "@/lib/mapUtils";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniResiliencePie from "@/components/charts/MiniResiliencePie";
import { Sprout, Truck, Store } from "lucide-react";

const PORTFOLIO_CONFIG: Record<
  string,
  { icon: typeof Sprout; label: string; color: string; bgColor: string }
> = {
  "smallholder-farmers": {
    icon: Sprout,
    label: "Smallholder Farmers",
    color: "text-green",
    bgColor: "bg-green-tint",
  },
  transporters: {
    icon: Truck,
    label: "Transporters",
    color: "text-plum",
    bgColor: "bg-purple-tint",
  },
  microentrepreneurs: {
    icon: Store,
    label: "Microentrepreneurs",
    color: "text-deep-purple",
    bgColor: "bg-gold-tint",
  },
};

interface LocationDetailPanelProps {
  location: EnrichedGeoLocation;
  gender: "all" | "men" | "women";
}

export default function LocationDetailPanel({
  location,
  gender,
}: LocationDetailPanelProps) {
  const partner = getPartnerById(location.partnerId);
  if (!partner) return null;

  const portfolioConf = PORTFOLIO_CONFIG[location.portfolio] || PORTFOLIO_CONFIG.microentrepreneurs;
  const PortfolioIcon = portfolioConf.icon;

  const getIncome = (point: { all: number; men: number; women: number }) => {
    if (gender === "men") return point.men;
    if (gender === "women") return point.women;
    return point.all;
  };

  const endlineIncome = getIncome(location.endlineIncome);
  const baselineIncome = getIncome(location.baselineIncome);
  const ratio = endlineIncome / location.livingWage;
  const color = incomeToColor(ratio);
  const upliftPct =
    baselineIncome > 0
      ? ((endlineIncome - baselineIncome) / baselineIncome) * 100
      : 0;

  return (
    <div className="space-y-5">
      {/* Partner Header */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-[var(--radius-button)] ${portfolioConf.bgColor} flex items-center justify-center shrink-0`}
        >
          <PortfolioIcon className={`w-5 h-5 ${portfolioConf.color}`} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-title">{location.partnerName}</h3>
          <p className="text-xs text-gray">{portfolioConf.label}</p>
          <p className="text-xs text-gray">
            {location.country} &middot; {location.asset} &middot; n={location.sampleSize}
          </p>
        </div>
      </div>

      {/* Income KPI Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Endline</p>
          <p className="text-base font-bold text-title">{formatCurrency(endlineIncome)}</p>
          <p className="text-[10px] text-gray">/day</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Living Wage</p>
          <p className="text-base font-bold text-title">{formatCurrency(location.livingWage)}</p>
          <p className="text-[10px] text-gray">/day</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Gap</p>
          <p className="text-base font-bold" style={{ color }}>
            {Math.round(ratio * 100)}%
          </p>
          <p className="text-[10px] text-gray">of target</p>
        </div>
      </div>

      {/* Income Trend */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Income Trend
        </h4>
        <div className="bg-surface rounded-[var(--radius-card)] p-3">
          <MiniSparkline
            baseline={baselineIncome}
            endline={endlineIncome}
            livingWage={location.livingWage}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray">
              Baseline: {formatCurrency(baselineIncome)}
            </span>
            <span className="text-[10px] font-medium text-green">
              +{upliftPct.toFixed(1)}% uplift
            </span>
          </div>
        </div>
      </div>

      {/* Gender Comparison */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Gender Comparison
        </h4>
        <div className="space-y-2">
          <GenderRow
            label="Men"
            color="#2A1055"
            income={location.endlineIncome.men}
            livingWage={location.livingWage}
          />
          <GenderRow
            label="Women"
            color="#910D63"
            income={location.endlineIncome.women}
            livingWage={location.livingWage}
          />
          <div className="pt-1 border-t border-surface-alt">
            <p className="text-[10px] text-gray">
              Gender gap:{" "}
              <span className="font-semibold text-plum">
                {formatCurrency(location.endlineIncome.men - location.endlineIncome.women)}
              </span>
              /day ({((1 - location.endlineIncome.women / location.endlineIncome.men) * 100).toFixed(1)}% lower for women)
            </p>
          </div>
        </div>
      </div>

      {/* Quality of Life */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Quality of Life
        </h4>
        <div className="space-y-1.5">
          {partner.qualityOfLife.map((q, i) => {
            const positive = q.stronglyAgree + q.agree;
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-body leading-tight line-clamp-1">
                    {q.question}
                  </span>
                  <span className="text-[10px] font-semibold text-title shrink-0 ml-2">
                    {positive}%
                  </span>
                </div>
                <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green"
                    style={{ width: `${positive}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resilience */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Financial Resilience
        </h4>
        <div className="flex items-center gap-3">
          <MiniResiliencePie data={partner.resilience} />
          <div className="flex-1 space-y-0.5">
            {partner.resilience.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: r.color }}
                />
                <span className="text-[10px] text-body">{r.label}</span>
                <span className="text-[10px] font-semibold text-title ml-auto">
                  {r.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income Benchmarks Reference */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Poverty Benchmarks
        </h4>
        <div className="space-y-1.5">
          {[
            {
              label: "World Bank International",
              value: partner.incomeBenchmarks.referenceLines.worldBankInternational,
              income: endlineIncome,
            },
            {
              label: "Country Poverty Line",
              value: partner.incomeBenchmarks.referenceLines.worldBankCountry,
              income: endlineIncome,
            },
            {
              label: "Living Wage",
              value: partner.incomeBenchmarks.referenceLines.livingWage,
              income: endlineIncome,
            },
          ].map((ref) => (
            <div
              key={ref.label}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="text-gray">{ref.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-body font-medium">
                  {formatCurrency(ref.value)}/day
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    ref.income >= ref.value ? "text-green" : "text-income-low"
                  }`}
                >
                  {ref.income >= ref.value ? "✓ Above" : "✗ Below"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenderRow({
  label,
  color,
  income,
  livingWage,
}: {
  label: string;
  color: string;
  income: number;
  livingWage: number;
}) {
  const pct = Math.round((income / livingWage) * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full shrink-0" style={{ borderColor: color, borderWidth: 2, backgroundColor: color + "20" }} />
      <span className="text-[11px] text-body w-14">{label}</span>
      <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-semibold text-title w-16 text-right">
        {formatCurrency(income)}/day
      </span>
    </div>
  );
}
