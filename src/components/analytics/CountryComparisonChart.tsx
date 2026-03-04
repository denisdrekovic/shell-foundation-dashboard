"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { CountryProjection } from "@/types/analytics";
import { formatCurrency } from "@/lib/formatters";

interface CountryComparisonChartProps {
  data: CountryProjection[];
  actorColor: string;
}

const COUNTRY_COLORS: Record<string, string> = {
  India: "#F59E0B",
  Kenya: "#10B981",
  Rwanda: "#6366F1",
  Nigeria: "#EC4899",
};

export default function CountryComparisonChart({
  data,
  actorColor,
}: CountryComparisonChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    country: d.country,
    baseline: d.baseline,
    projected: d.projected,
    livingWage: d.livingWage,
    gap: d.gap,
    partners: d.partners.join(", "),
  }));

  return (
    <div
      role="img"
      aria-label="Country comparison chart showing baseline and projected incomes across operating markets"
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis
              dataKey="country"
              tick={{ fontSize: 10, fill: "#6D6A6A" }}
              tickLine={false}
              axisLine={{ stroke: "#EDEBEF" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6D6A6A" }}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white rounded-lg shadow-lg border border-surface-alt p-2.5 text-[11px]">
                    <p className="font-semibold text-title mb-1">{d.country}</p>
                    <p className="text-gray">
                      Baseline: {formatCurrency(d.baseline)}/day
                    </p>
                    <p style={{ color: actorColor }}>
                      Projected: {formatCurrency(d.projected)}/day
                    </p>
                    <p className="text-gray">
                      Living wage: {formatCurrency(d.livingWage)}/day
                    </p>
                    {d.gap > 0 && (
                      <p className="text-[#DC2626]">
                        Gap: {formatCurrency(d.gap)}/day
                      </p>
                    )}
                    <p className="text-[9px] text-gray mt-1 border-t border-surface-alt pt-1">
                      {d.partners}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="baseline"
              fill="#EDEBEF"
              radius={[3, 3, 0, 0]}
              name="Baseline"
              barSize={20}
            />
            <Bar
              dataKey="projected"
              radius={[3, 3, 0, 0]}
              name="Projected"
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COUNTRY_COLORS[entry.country] || actorColor}
                />
              ))}
            </Bar>
            {/* Show each country's living wage as markers */}
            {chartData.map((d, i) => (
              <ReferenceLine
                key={i}
                y={d.livingWage}
                stroke="#00A17D"
                strokeDasharray="4 3"
                strokeWidth={i === 0 ? 1 : 0}
                label={
                  i === 0
                    ? {
                        value: "Living Wage",
                        position: "right",
                        fontSize: 9,
                        fill: "#00A17D",
                      }
                    : undefined
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[9px] text-gray">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EDEBEF] inline-block" />
          Baseline
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: actorColor }}
          />
          Projected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 border-t border-dashed border-[#00A17D] inline-block" />
          Living Wage
        </span>
      </div>
    </div>
  );
}

export { type CountryComparisonChartProps };
