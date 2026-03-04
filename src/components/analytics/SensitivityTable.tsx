"use client";

import { SensitivityRow } from "@/types/analytics";
import { formatCurrency } from "@/lib/formatters";

interface SensitivityTableProps {
  data: SensitivityRow[];
}

export default function SensitivityTable({ data }: SensitivityTableProps) {
  const maxElasticity = Math.max(...data.map((d) => d.elasticity), 0.01);

  return (
    <div
      className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4"
      role="region"
      aria-label="Sensitivity analysis: impact of income drivers ranked by sensitivity"
    >
      <h3 className="text-xs font-semibold text-title uppercase tracking-wider mb-1">
        Sensitivity Analysis
      </h3>
      <p className="text-[10px] text-gray mb-3">
        Impact of +10% change in each driver on projected income (ranked by sensitivity)
      </p>
      <div className="space-y-2.5" role="list" aria-label="Income drivers by sensitivity">
        {data.map((row) => {
          const barWidth = (row.elasticity / maxElasticity) * 100;
          const isPositive = row.direction === "positive";

          return (
            <div
              key={row.driver}
              role="listitem"
              aria-label={`${row.driver}: ${isPositive ? "+" : ""}${formatCurrency(row.currentImpact)} per day impact, ${row.elasticity.toFixed(1)}% sensitivity`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-title">
                  {row.driver}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold ${
                      isPositive ? "text-green" : "text-income-low"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(row.currentImpact)}/day
                  </span>
                  <span className="text-[10px] text-gray">
                    ({row.elasticity.toFixed(1)}% sensitivity)
                  </span>
                </div>
              </div>
              <div className="h-2 bg-surface-alt rounded-full overflow-hidden" aria-hidden="true">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isPositive ? "#00A17D" : "#DC2626",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
