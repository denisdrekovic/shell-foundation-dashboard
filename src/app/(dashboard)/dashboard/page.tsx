"use client";

import { useState, useMemo } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { enrichGeoData, filterLocations } from "@/lib/dataAggregation";
import { EnrichedGeoLocation } from "@/types/map";
import InteractiveMap from "@/components/map/InteractiveMap";
import MapLegend from "@/components/map/MapLegend";
import DetailPanel from "@/components/layout/DetailPanel";
import LocationDetailPanel from "@/components/map/LocationDetailPanel";
import WomensEmpowermentCard from "@/components/cards/WomensEmpowermentCard";
import HeroStat from "@/components/cards/HeroStat";
import CategoryCard from "@/components/cards/CategoryCard";
import Card from "@/components/ui/Card";
import MetricTooltip from "@/components/ui/MetricTooltip";
import overviewData from "@/data/overview.json";
import { formatCurrency } from "@/lib/formatters";
import { incomeToColor } from "@/lib/mapUtils";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function DashboardPage() {
  const { filters } = useFilters();
  const [selectedLocation, setSelectedLocation] =
    useState<EnrichedGeoLocation | null>(null);

  const allLocations = useMemo(() => enrichGeoData(), []);

  const filteredLocations = useMemo(
    () => filterLocations(allLocations, filters),
    [allLocations, filters]
  );

  const handleMarkerClick = (loc: EnrichedGeoLocation) => {
    setSelectedLocation(loc);
  };

  // Summary KPIs for the filtered set
  const summaryStats = useMemo(() => {
    if (filteredLocations.length === 0) return null;

    const avgEndline =
      filteredLocations.reduce((s, l) => s + l.endlineIncome.all, 0) /
      filteredLocations.length;
    const avgBaseline =
      filteredLocations.reduce((s, l) => s + l.baselineIncome.all, 0) /
      filteredLocations.length;
    const avgRatio =
      filteredLocations.reduce((s, l) => s + l.incomeToWageRatio, 0) /
      filteredLocations.length;
    const totalSample = filteredLocations.reduce(
      (s, l) => s + l.sampleSize,
      0
    );
    const aboveLivingWage = filteredLocations.filter(
      (l) => l.incomeToWageRatio >= 1
    ).length;

    // Baseline-period comparisons for trend indicators
    const avgBaselineRatio =
      filteredLocations.reduce(
        (s, l) => s + (l.baselineIncome.all / l.livingWage),
        0
      ) / filteredLocations.length;
    const aboveLivingWageBaseline = filteredLocations.filter(
      (l) => l.baselineIncome.all / l.livingWage >= 1
    ).length;
    const incomeChangePct =
      avgBaseline > 0 ? ((avgEndline - avgBaseline) / avgBaseline) * 100 : 0;
    const ratioChangePct =
      avgBaselineRatio > 0
        ? ((avgRatio - avgBaselineRatio) / avgBaselineRatio) * 100
        : 0;

    return {
      avgEndline,
      avgBaseline,
      avgRatio,
      avgBaselineRatio,
      totalSample,
      aboveLivingWage,
      aboveLivingWageBaseline,
      incomeChangePct,
      ratioChangePct,
      partnerCount: filteredLocations.length,
    };
  }, [filteredLocations]);

  const panelOpen = selectedLocation !== null;

  return (
    <div
      className="space-y-6 transition-all duration-300 ease-in-out"
      style={{ marginRight: panelOpen ? 400 : 0 }}
    >
      {/* Hero stat */}
      <HeroStat
        achieved={overviewData.heroStat.achieved}
        total={overviewData.heroStat.total}
        threshold={overviewData.heroStat.threshold}
        metric={overviewData.heroStat.metric}
      />

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {overviewData.categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            label={cat.label}
            achieved={cat.achieved}
            total={cat.total}
            icon={cat.icon}
          />
        ))}
      </div>

      {/* Summary KPI strip */}
      {summaryStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" role="list" aria-label="Key performance indicators">
          <KPICard
            label={<>Partners <MetricTooltip text="Number of Shell Foundation partner organizations included in the current filtered view." /></>}
            value={String(summaryStats.partnerCount)}
            sub={`of ${allLocations.length} total`}
          />
          <KPICard
            label={<>Avg Income <MetricTooltip text="Average daily endline income across all partners in the current view, in USD per day." /></>}
            value={formatCurrency(summaryStats.avgEndline)}
            sub="/day (endline)"
            trend={{ value: summaryStats.incomeChangePct, label: "vs baseline" }}
          />
          <KPICard
            label={<>Living Wage Gap <MetricTooltip text="Average endline income as a percentage of the local living wage benchmark. 100% means income meets the living wage." /></>}
            value={`${Math.round(summaryStats.avgRatio * 100)}%`}
            sub="of living wage"
            color={summaryStats.avgRatio >= 0.8 ? "text-green" : summaryStats.avgRatio >= 0.5 ? "text-gold" : "text-income-low"}
            trend={{ value: summaryStats.ratioChangePct, label: "vs baseline" }}
          />
          <KPICard
            label={<>Above Living Wage <MetricTooltip text="Number of partners whose average endline income meets or exceeds the local living wage." /></>}
            value={String(summaryStats.aboveLivingWage)}
            sub={`of ${summaryStats.partnerCount} partners`}
            trend={{
              value: summaryStats.aboveLivingWageBaseline > 0
                ? ((summaryStats.aboveLivingWage - summaryStats.aboveLivingWageBaseline) / summaryStats.aboveLivingWageBaseline) * 100
                : summaryStats.aboveLivingWage > 0 ? 100 : 0,
              label: "vs baseline",
            }}
          />
          <KPICard
            label={<>Total Sample <MetricTooltip text="Total number of beneficiaries surveyed across all partners in the current filtered view." /></>}
            value={summaryStats.totalSample.toLocaleString()}
            sub="beneficiaries"
          />
        </div>
      )}

      {/* Interactive Map with embedded legend */}
      <Card className="p-0 overflow-hidden">
        <div className="relative h-[520px]">
          <InteractiveMap
            locations={filteredLocations}
            selectedPartnerId={selectedLocation?.partnerId || null}
            onMarkerClick={handleMarkerClick}
            gender={filters.gender}
          />
          <MapLegend />
        </div>
      </Card>

      {/* Partner quick-nav strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="list" aria-label="Partner quick navigation">
        <span className="text-[10px] text-gray uppercase tracking-wide font-semibold whitespace-nowrap shrink-0">
          Partners ({filteredLocations.length}):
        </span>
        {filteredLocations.map((loc) => {
          const ratio = loc.endlineIncome.all / loc.livingWage;
          return (
            <button
              key={loc.partnerId}
              onClick={() => handleMarkerClick(loc)}
              role="listitem"
              aria-label={`${loc.partnerName}: ${Math.round(ratio * 100)}% of living wage, ${formatCurrency(loc.endlineIncome.all)} per day`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-plum/40 ${
                selectedLocation?.partnerId === loc.partnerId
                  ? "bg-plum text-white shadow-sm"
                  : "bg-white shadow-[var(--shadow-card)] text-title hover:shadow-md"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: incomeToColor(ratio) }}
                aria-hidden="true"
              />
              <span className="font-medium">{loc.partnerName}</span>
              <span
                className={`text-[10px] font-bold ${
                  selectedLocation?.partnerId === loc.partnerId ? "text-white/80" : ""
                }`}
                style={selectedLocation?.partnerId !== loc.partnerId ? { color: incomeToColor(ratio) } : undefined}
              >
                {Math.round(ratio * 100)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Women's Empowerment */}
      <WomensEmpowermentCard locations={filteredLocations} />

      {/* Detail Panel (slides in from right) */}
      <DetailPanel
        isOpen={selectedLocation !== null}
        onClose={() => setSelectedLocation(null)}
        title={selectedLocation?.partnerName || ""}
        subtitle={
          selectedLocation
            ? `${selectedLocation.country} · ${selectedLocation.asset}`
            : ""
        }
      >
        {selectedLocation && (
          <LocationDetailPanel
            location={selectedLocation}
            gender={filters.gender}
          />
        )}
      </DetailPanel>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  color,
  trend,
}: {
  label: ReactNode;
  value: string;
  sub: string;
  color?: string;
  trend?: { value: number; label: string };
}) {
  const TrendIcon =
    trend && Math.abs(trend.value) < 0.5
      ? Minus
      : trend && trend.value >= 0
        ? TrendingUp
        : TrendingDown;

  const trendColor =
    trend && Math.abs(trend.value) < 0.5
      ? "text-gray"
      : trend && trend.value >= 0
        ? "text-green"
        : "text-income-low";

  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-3 text-center" role="listitem">
      <p className="text-[10px] text-gray uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold font-[var(--font-heading)] ${color || "text-title"} mt-0.5`}>
        {value}
      </p>
      <p className="text-[10px] text-gray">{sub}</p>
      {trend && (
        <div className={`flex items-center justify-center gap-1 mt-1.5 ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="text-[11px] font-semibold">
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
          <span className="text-[10px] text-gray font-normal">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
