"use client";

import { EnrichedGeoLocation } from "@/types/map";
import { formatCurrency } from "@/lib/formatters";
import Card from "@/components/ui/Card";

interface WomensEmpowermentCardProps {
  locations: EnrichedGeoLocation[];
}

export default function WomensEmpowermentCard({
  locations,
}: WomensEmpowermentCardProps) {
  if (locations.length === 0) return null;

  // Group by country
  const countryMap = new Map<string, EnrichedGeoLocation[]>();
  locations.forEach((loc) => {
    const existing = countryMap.get(loc.country) || [];
    existing.push(loc);
    countryMap.set(loc.country, existing);
  });

  // Aggregate stats
  const totalWomen = locations.reduce((s, l) => s + l.endlineIncome.women, 0) / locations.length;
  const totalMen = locations.reduce((s, l) => s + l.endlineIncome.men, 0) / locations.length;
  const avgGap = ((1 - totalWomen / totalMen) * 100).toFixed(1);

  return (
    <Card className="overflow-hidden" aria-label={`Women's Economic Empowerment: average gender income gap is ${avgGap}% lower for women`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#910D6320" }}>
          <span className="text-lg">♀</span>
        </div>
        <div>
          <h3 className="text-sm font-bold font-[var(--font-heading)] text-title">
            Women&apos;s Economic Empowerment
          </h3>
          <p className="text-xs text-gray">
            Average gender income gap:{" "}
            <span className="font-semibold text-plum">{avgGap}%</span> lower for women
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <h4 className="text-xs font-semibold text-title mb-2">
                {country}
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#2A1055" }} />
                  <span className="text-[11px] text-gray flex-1">Men</span>
                  <span className="text-[11px] font-semibold text-title">
                    {formatCurrency(avgMen)}/day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#910D63" }} />
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
                      style={{ width: `${(avgMen / Math.max(avgMen, avgWomen)) * 100}%`, backgroundColor: "#2A1055" }}
                    />
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    <div
                      className="h-2 rounded-l-full"
                      style={{ width: `${(avgWomen / Math.max(avgMen, avgWomen)) * 100}%`, backgroundColor: "#910D63" }}
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
                      {l.partnerName}: ♂{formatCurrency(l.endlineIncome.men)} ♀{formatCurrency(l.endlineIncome.women)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
