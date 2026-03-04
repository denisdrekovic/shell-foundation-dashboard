"use client";

import { useState, useMemo } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { enrichGeoData, filterLocations } from "@/lib/dataAggregation";
import { EnrichedGeoLocation } from "@/types/map";
import { PortfolioCategory } from "@/types/partner";
import { formatCurrency } from "@/lib/formatters";
import { incomeToColor } from "@/lib/mapUtils";
import GroupComparisonChart from "@/components/segmentation/GroupComparisonChart";
import ChartContainer from "@/components/ui/ChartContainer";
import { prepareGroupCompCSV } from "@/lib/csvHelpers";
import clsx from "clsx";

type CompareBy = "country" | "portfolio" | "income-band";

const COMPARE_OPTIONS: { id: CompareBy; label: string; description: string }[] =
  [
    {
      id: "country",
      label: "By Country",
      description: "Group by operating country",
    },
    {
      id: "portfolio",
      label: "By Portfolio",
      description: "Group by portfolio category",
    },
    {
      id: "income-band",
      label: "By Income Band",
      description: "Group by living wage distance",
    },
  ];

const PORTFOLIO_LABELS: Record<PortfolioCategory, string> = {
  "smallholder-farmers": "Smallholder Farmers",
  transporters: "Transporters",
  microentrepreneurs: "Microentrepreneurs",
};

// Brand palette
const COUNTRY_COLORS: Record<string, string> = {
  India: "#2A1055",
  Kenya: "#910D63",
  Rwanda: "#00A17D",
  Nigeria: "#FFC000",
};

const PORTFOLIO_COLORS: Record<string, string> = {
  "Smallholder Farmers": "#00A17D",
  Transporters: "#2A1055",
  Microentrepreneurs: "#FFC000",
};

const BAND_COLORS: Record<string, string> = {
  above: "#00A17D",
  near: "#FFC000",
  below: "#DC2626",
};

export default function SegmentationPage() {
  const [compareBy, setCompareBy] = useState<CompareBy>("country");
  const { filters } = useFilters();
  const allLocations = useMemo(() => enrichGeoData(), []);
  const filteredLocations = useMemo(
    () => filterLocations(allLocations, filters),
    [allLocations, filters]
  );

  const gender = filters.gender;

  // Get income based on selected gender
  const getIncome = (loc: EnrichedGeoLocation) => {
    if (gender === "men") return loc.endlineIncome.men;
    if (gender === "women") return loc.endlineIncome.women;
    return loc.endlineIncome.all;
  };

  const groups = useMemo(() => {
    switch (compareBy) {
      case "country":
        return groupByCountry(filteredLocations);
      case "portfolio":
        return groupByPortfolio(filteredLocations);
      case "income-band":
        return groupByIncomeBand(filteredLocations);
      default:
        return [];
    }
  }, [filteredLocations, compareBy]);

  // Chart data — respects gender toggle
  const chartGroups = groups.map((g) => {
    const n = g.locations.length || 1;
    const avgIncome =
      g.locations.reduce((s, l) => s + getIncome(l), 0) / n;
    const avgMen =
      g.locations.reduce((s, l) => s + l.endlineIncome.men, 0) / n;
    const avgWomen =
      g.locations.reduce((s, l) => s + l.endlineIncome.women, 0) / n;
    const avgRatio =
      g.locations.length > 0
        ? (g.locations.reduce((s, l) => s + l.incomeToWageRatio, 0) / n) * 100
        : 0;

    return {
      name: g.name,
      avgIncome,
      avgMen,
      avgWomen,
      avgRatio,
      count: g.locations.length,
      color: g.color,
    };
  });

  const genderLabel =
    gender === "men" ? " (Men)" : gender === "women" ? " (Women)" : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-title">
          Segmentation
        </h1>
        <p className="text-sm text-gray mt-1">
          Break down portfolio performance by dimension.
          {gender !== "all" && (
            <span className="text-plum font-medium">
              {" "}Showing {gender}&apos;s income data.
            </span>
          )}
        </p>
      </div>

      {/* Compare By */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Comparison dimension">
        {COMPARE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setCompareBy(opt.id)}
            role="tab"
            aria-selected={compareBy === opt.id}
            title={opt.description}
            className={clsx(
              "px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-plum/40",
              compareBy === opt.id
                ? "bg-deep-purple text-white shadow-sm"
                : "bg-white text-gray hover:text-title shadow-[var(--shadow-card)]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer
          title={`Average Income${genderLabel}`}
          subtitle="Average daily income at endline ($/day)"
          csvData={prepareGroupCompCSV(chartGroups)}
          csvFilename={`segmentation-income-${compareBy}`}
          tableView={
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                    <th className="text-left py-2 pr-3 font-medium">Group</th>
                    <th className="text-right py-2 px-3 font-medium">Avg Income ($/day)</th>
                    <th className="text-right py-2 px-3 font-medium">Men ($/day)</th>
                    <th className="text-right py-2 px-3 font-medium">Women ($/day)</th>
                    <th className="text-right py-2 pl-3 font-medium">Partners</th>
                  </tr>
                </thead>
                <tbody>
                  {chartGroups.map((g) => (
                    <tr key={g.name} className="border-b border-surface-alt/50">
                      <td className="py-1.5 pr-3 font-medium text-title flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: g.color }} />
                        {g.name}
                      </td>
                      <td className="py-1.5 px-3 text-right">{formatCurrency(g.avgIncome)}</td>
                      <td className="py-1.5 px-3 text-right">{formatCurrency(g.avgMen)}</td>
                      <td className="py-1.5 px-3 text-right">{formatCurrency(g.avgWomen)}</td>
                      <td className="py-1.5 pl-3 text-right">{g.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        >
          <GroupComparisonChart
            groups={chartGroups}
            metric="income"
            title={`Average Income${genderLabel}`}
          />
        </ChartContainer>
        <ChartContainer
          title="Living Wage Progress"
          subtitle="Average income as % of living wage"
          csvData={prepareGroupCompCSV(chartGroups)}
          csvFilename={`segmentation-ratio-${compareBy}`}
          tableView={
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                    <th className="text-left py-2 pr-3 font-medium">Group</th>
                    <th className="text-right py-2 px-3 font-medium">% of Living Wage</th>
                    <th className="text-right py-2 pl-3 font-medium">Partners</th>
                  </tr>
                </thead>
                <tbody>
                  {chartGroups.map((g) => (
                    <tr key={g.name} className="border-b border-surface-alt/50">
                      <td className="py-1.5 pr-3 font-medium text-title flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: g.color }} />
                        {g.name}
                      </td>
                      <td className="py-1.5 px-3 text-right">{g.avgRatio.toFixed(0)}%</td>
                      <td className="py-1.5 pl-3 text-right">{g.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        >
          <GroupComparisonChart
            groups={chartGroups}
            metric="ratio"
            title="Living Wage Progress"
          />
        </ChartContainer>
      </div>

      {/* Groups as clean tables */}
      <div className="space-y-4">
        {groups.map((g) => {
          if (g.locations.length === 0) return null;

          const n = g.locations.length;
          const avgInc = g.locations.reduce((s, l) => s + getIncome(l), 0) / n;
          const avgRatio =
            g.locations.reduce((s, l) => s + l.incomeToWageRatio, 0) / n;
          const totalSample = g.locations.reduce(
            (s, l) => s + l.sampleSize,
            0
          );
          const avgGap =
            g.locations.reduce(
              (s, l) =>
                s + (1 - l.endlineIncome.women / l.endlineIncome.men) * 100,
              0
            ) / n;

          return (
            <div
              key={g.name}
              className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden"
            >
              {/* Accent header */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ backgroundColor: g.color + "18" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <div>
                    <h3
                      className="text-sm font-bold font-[var(--font-heading)]"
                      style={{ color: g.color }}
                    >
                      {g.name}
                    </h3>
                    <p className="text-[10px] text-gray">
                      {n} partner{n !== 1 ? "s" : ""} &middot;{" "}
                      {totalSample.toLocaleString()} beneficiaries
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Stat label="Avg Income" value={formatCurrency(avgInc) + "/day"} />
                  <Stat
                    label="Living Wage"
                    value={Math.round(avgRatio * 100) + "%"}
                    valueColor={incomeToColor(avgRatio)}
                  />
                  <Stat label="Gender Gap" value={avgGap.toFixed(1) + "%"} />
                </div>
              </div>

              {/* Partner table */}
              <table className="w-full text-[11px]" aria-label={`Partners in ${g.name}`}>
                <thead>
                  <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                    <th scope="col" className="text-left px-5 py-2 font-medium">Partner</th>
                    <th scope="col" className="text-left px-3 py-2 font-medium">Country</th>
                    <th scope="col" className="text-right px-3 py-2 font-medium">
                      Income{genderLabel}
                    </th>
                    <th scope="col" className="text-right px-3 py-2 font-medium">
                      Living Wage
                    </th>
                    <th scope="col" className="text-right px-3 py-2 font-medium">♂ Men</th>
                    <th scope="col" className="text-right px-3 py-2 font-medium">♀ Women</th>
                    <th scope="col" className="text-right px-3 py-2 font-medium">Gap</th>
                    <th scope="col" className="text-right px-5 py-2 font-medium">Sample</th>
                  </tr>
                </thead>
                <tbody>
                  {g.locations.map((loc) => {
                    const income = getIncome(loc);
                    const ratio = loc.incomeToWageRatio;
                    const gap = (
                      (1 -
                        loc.endlineIncome.women / loc.endlineIncome.men) *
                      100
                    ).toFixed(1);

                    return (
                      <tr
                        key={loc.partnerId}
                        className="border-b border-surface-alt/50 hover:bg-surface/50 transition-colors"
                      >
                        <td className="px-5 py-2.5 font-medium text-title">
                          {loc.partnerName}
                        </td>
                        <td className="px-3 py-2.5 text-gray">
                          {loc.country}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-title">
                          {formatCurrency(income)}/day
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span
                            className="font-bold"
                            style={{ color: incomeToColor(ratio) }}
                          >
                            {Math.round(ratio * 100)}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right" style={{ color: "#2A1055" }}>
                          {formatCurrency(loc.endlineIncome.men)}
                        </td>
                        <td className="px-3 py-2.5 text-right" style={{ color: "#910D63" }}>
                          {formatCurrency(loc.endlineIncome.women)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray">
                          {gap}%
                        </td>
                        <td className="px-5 py-2.5 text-right text-gray">
                          {loc.sampleSize}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="text-right">
      <p className="text-[9px] text-gray uppercase tracking-wide">{label}</p>
      <p
        className="text-xs font-bold"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

// ── Grouping functions ──

interface GroupResult {
  name: string;
  locations: EnrichedGeoLocation[];
  color: string;
}

function groupByCountry(locations: EnrichedGeoLocation[]): GroupResult[] {
  const countries = ["India", "Kenya", "Rwanda", "Nigeria"];
  return countries
    .map((country) => ({
      name: country,
      locations: locations.filter((l) => l.country === country),
      color: COUNTRY_COLORS[country] || "#7C6AA0",
    }))
    .filter((g) => g.locations.length > 0);
}

function groupByPortfolio(locations: EnrichedGeoLocation[]): GroupResult[] {
  const portfolios: PortfolioCategory[] = [
    "smallholder-farmers",
    "transporters",
    "microentrepreneurs",
  ];
  return portfolios
    .map((p) => {
      const label = PORTFOLIO_LABELS[p];
      return {
        name: label,
        locations: locations.filter((l) => l.portfolio === p),
        color: PORTFOLIO_COLORS[label] || "#7C6AA0",
      };
    })
    .filter((g) => g.locations.length > 0);
}

function groupByIncomeBand(locations: EnrichedGeoLocation[]): GroupResult[] {
  return [
    {
      name: "Above Living Wage (\u2265100%)",
      locations: locations.filter((l) => l.incomeToWageRatio >= 1),
      color: BAND_COLORS.above,
    },
    {
      name: "Near Living Wage (70\u201399%)",
      locations: locations.filter(
        (l) => l.incomeToWageRatio >= 0.7 && l.incomeToWageRatio < 1
      ),
      color: BAND_COLORS.near,
    },
    {
      name: "Below Living Wage (<70%)",
      locations: locations.filter((l) => l.incomeToWageRatio < 0.7),
      color: BAND_COLORS.below,
    },
  ].filter((g) => g.locations.length > 0);
}
