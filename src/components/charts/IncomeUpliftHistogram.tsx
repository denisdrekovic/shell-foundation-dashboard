"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { UpliftBin } from "@/types/partner";
import { CHART_COLORS } from "@/lib/colors";
import clsx from "clsx";

interface IncomeUpliftHistogramProps {
  bins: UpliftBin[];
  mean: number | null;
  median: number | null;
  title?: string;
}

type GenderFilter = "all" | "men" | "women";

export default function IncomeUpliftHistogram({
  bins,
  mean,
  median,
  title,
}: IncomeUpliftHistogramProps) {
  const [filter, setFilter] = useState<GenderFilter>("all");

  const dataKey = filter;
  const fillColor =
    filter === "men"
      ? CHART_COLORS.men
      : filter === "women"
        ? CHART_COLORS.women
        : CHART_COLORS.all;

  // Find the bin index closest to mean and median for reference lines
  const meanBin = mean != null ? bins.reduce((closest, bin, i) => {
    const binMid = (bin.rangeLow + bin.rangeHigh) / 2;
    const closestMid = (bins[closest].rangeLow + bins[closest].rangeHigh) / 2;
    return Math.abs(binMid - mean) < Math.abs(closestMid - mean) ? i : closest;
  }, 0) : null;

  const medianBin = median != null ? bins.reduce((closest, bin, i) => {
    const binMid = (bin.rangeLow + bin.rangeHigh) / 2;
    const closestMid = (bins[closest].rangeLow + bins[closest].rangeHigh) / 2;
    return Math.abs(binMid - median) < Math.abs(closestMid - median)
      ? i
      : closest;
  }, 0) : null;

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-title mb-3">
          {title}
        </h3>
      )}

      {/* Gender filter pills */}
      <div className="flex gap-2 mb-4">
        {(["all", "men", "women"] as GenderFilter[]).map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={clsx(
              "px-3 py-1.5 rounded-[var(--radius-button)] text-xs font-medium transition-all",
              filter === g
                ? "text-white shadow-sm"
                : "bg-surface-alt text-gray hover:bg-surface"
            )}
            style={
              filter === g
                ? {
                    backgroundColor:
                      g === "men"
                        ? CHART_COLORS.men
                        : g === "women"
                          ? CHART_COLORS.women
                          : CHART_COLORS.all,
                  }
                : undefined
            }
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bins}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis
              dataKey="rangeLabel"
              tick={{ fontSize: 9, fill: "#6D6A6A" }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6D6A6A" }}
              label={{
                value: "# of Respondents",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 11, fill: "#6D6A6A" },
              }}
            />
            <Tooltip
              formatter={(value) => [Number(value), "Respondents"]}
              labelFormatter={(label) => `${label}% Net Income Uplift`}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: 12,
              }}
            />
            {mean != null && meanBin != null && (
              <ReferenceLine
                x={bins[meanBin]?.rangeLabel}
                stroke={CHART_COLORS.referenceLines.mean}
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Mean: ${mean.toFixed(1)}%`,
                  position: "top",
                  fontSize: 10,
                  fill: CHART_COLORS.referenceLines.mean,
                }}
              />
            )}
            {median != null && medianBin != null && (
              <ReferenceLine
                x={bins[medianBin]?.rangeLabel}
                stroke={CHART_COLORS.referenceLines.median}
                strokeWidth={2}
                label={{
                  value: `Median: ${median.toFixed(1)}%`,
                  position: "top",
                  fontSize: 10,
                  fill: CHART_COLORS.referenceLines.median,
                }}
              />
            )}
            <Bar dataKey={dataKey} fill={fillColor} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-xs text-gray mt-2">
        % Net Income Uplift
      </p>
    </div>
  );
}
