"use client";

import { EnrichedGeoLocation } from "@/types/map";
import { formatCurrency } from "@/lib/formatters";

interface WomensEmpowermentSidebarContentProps {
  locations: EnrichedGeoLocation[];
}

export default function WomensEmpowermentSidebarContent({
  locations,
}: WomensEmpowermentSidebarContentProps) {
  if (locations.length === 0) {
    return (
      <p className="text-sm text-gray text-center py-8">
        No partner data matches current filters.
      </p>
    );
  }

  // Group by country
  const countryMap = new Map<string, EnrichedGeoLocation[]>();
  locations.forEach((loc) => {
    const existing = countryMap.get(loc.country) || [];
    existing.push(loc);
    countryMap.set(loc.country, existing);
  });

  // Aggregate stats
  const totalWomen =
    locations.reduce((s, l) => s + l.endlineIncome.women, 0) / locations.length;
  const totalMen =
    locations.reduce((s, l) => s + l.endlineIncome.men, 0) / locations.length;
  const avgGap = ((1 - totalWomen / totalMen) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Aggregate summary KPIs */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Men</p>
          <p className="text-base font-bold" style={{ color: "#2A1055" }}>
            {formatCurrency(totalMen)}
          </p>
          <p className="text-[10px] text-gray">/day avg</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Women</p>
          <p className="text-base font-bold" style={{ color: "#910D63" }}>
            {formatCurrency(totalWomen)}
          </p>
          <p className="text-[10px] text-gray">/day avg</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-button)] p-2.5 text-center">
          <p className="text-[10px] text-gray uppercase tracking-wide">Gap</p>
          <p className="text-base font-bold text-plum">{avgGap}%</p>
          <p className="text-[10px] text-gray">lower for women</p>
        </div>
      </div>

      {/* Portfolio-wide gender bars */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          Portfolio Gender Gap
        </h4>
        <div className="space-y-2">
          <GenderBar label="Men" color="#2A1055" income={totalMen} maxIncome={Math.max(totalMen, totalWomen)} />
          <GenderBar label="Women" color="#910D63" income={totalWomen} maxIncome={Math.max(totalMen, totalWomen)} />
          <p className="text-[10px] text-plum font-medium">
            Gap: {avgGap}% ({formatCurrency(totalMen - totalWomen)}/day)
          </p>
        </div>
      </div>

      {/* Country breakdowns */}
      <div>
        <h4 className="text-xs font-semibold text-title uppercase tracking-wide mb-2">
          By Country
        </h4>
        <div className="space-y-3">
          {Array.from(countryMap.entries()).map(([country, locs]) => {
            const avgMen =
              locs.reduce((s, l) => s + l.endlineIncome.men, 0) / locs.length;
            const avgWomen =
              locs.reduce((s, l) => s + l.endlineIncome.women, 0) / locs.length;
            const gap = ((1 - avgWomen / avgMen) * 100).toFixed(1);

            return (
              <div
                key={country}
                className="bg-surface rounded-[var(--radius-card)] p-3"
              >
                <h5 className="text-xs font-semibold text-title mb-2">
                  {country}
                </h5>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#2A1055" }}
                    />
                    <span className="text-[11px] text-gray flex-1">Men</span>
                    <span className="text-[11px] font-semibold text-title">
                      {formatCurrency(avgMen)}/day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#910D63" }}
                    />
                    <span className="text-[11px] text-gray flex-1">Women</span>
                    <span className="text-[11px] font-semibold text-title">
                      {formatCurrency(avgWomen)}/day
                    </span>
                  </div>

                  {/* Visual gap bar */}
                  <div className="pt-1" aria-hidden="true">
                    <div className="flex gap-0.5">
                      <div
                        className="h-2 rounded-l-full"
                        style={{
                          width: `${(avgMen / Math.max(avgMen, avgWomen)) * 100}%`,
                          backgroundColor: "#2A1055",
                        }}
                      />
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      <div
                        className="h-2 rounded-l-full"
                        style={{
                          width: `${(avgWomen / Math.max(avgMen, avgWomen)) * 100}%`,
                          backgroundColor: "#910D63",
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-plum font-medium pt-0.5">
                    Gap: {gap}% ({formatCurrency(avgMen - avgWomen)}/day)
                  </p>

                  {/* Partners in this country */}
                  <div className="pt-1 border-t border-surface-alt">
                    {locs.map((l) => (
                      <p key={l.partnerId} className="text-[10px] text-gray">
                        {l.partnerName}: ♂{formatCurrency(l.endlineIncome.men)} ♀
                        {formatCurrency(l.endlineIncome.women)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GenderBar({
  label,
  color,
  income,
  maxIncome,
}: {
  label: string;
  color: string;
  income: number;
  maxIncome: number;
}) {
  const pct = (income / maxIncome) * 100;

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ borderColor: color, borderWidth: 2, backgroundColor: color + "20" }}
      />
      <span className="text-[11px] text-body w-14">{label}</span>
      <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-semibold text-title w-16 text-right">
        {formatCurrency(income)}/day
      </span>
    </div>
  );
}
