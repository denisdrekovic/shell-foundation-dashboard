"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BenchmarkPoint } from "@/types/partner";
import { CHART_COLORS } from "@/lib/colors";

interface IncomeBenchmarksLineProps {
  baseline: BenchmarkPoint;
  endline: BenchmarkPoint;
  referenceLines: {
    worldBankInternational: number;
    worldBankCountry: number;
    livingWage: number;
  };
  title?: string;
}

export default function IncomeBenchmarksLine({
  baseline,
  endline,
  referenceLines,
  title,
}: IncomeBenchmarksLineProps) {
  const data = [
    {
      label: "Baseline",
      men: baseline.men,
      women: baseline.women,
      all: baseline.all,
    },
    {
      label: "Endline",
      men: endline.men,
      women: endline.women,
      all: endline.all,
    },
  ];

  const maxValue = Math.max(
    endline.men,
    endline.women,
    endline.all,
    referenceLines.livingWage,
    referenceLines.worldBankCountry
  );

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-title mb-4">
          {title}
        </h3>
      )}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 120, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#3D4043" }}
            />
            <YAxis
              domain={[0, Math.ceil(maxValue + 2)]}
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: "#6D6A6A" }}
              label={{
                value: "USD per Day",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 11, fill: "#6D6A6A" },
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                `$${Number(value).toFixed(2)}`,
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: 12,
              }}
            />
            <Legend
              iconType="line"
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />

            {/* Reference lines */}
            <ReferenceLine
              y={referenceLines.worldBankInternational}
              stroke={CHART_COLORS.referenceLines.extremePoverty}
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: "Intl Poverty Line",
                position: "right",
                fontSize: 9,
                fill: CHART_COLORS.referenceLines.extremePoverty,
              }}
            />
            <ReferenceLine
              y={referenceLines.worldBankCountry}
              stroke={CHART_COLORS.referenceLines.poverty}
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: "Country Poverty Line",
                position: "right",
                fontSize: 9,
                fill: CHART_COLORS.referenceLines.poverty,
              }}
            />
            <ReferenceLine
              y={referenceLines.livingWage}
              stroke={CHART_COLORS.referenceLines.livingWage}
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: "Living Wage",
                position: "right",
                fontSize: 9,
                fill: CHART_COLORS.referenceLines.livingWage,
              }}
            />

            {/* Data lines */}
            <Line
              type="monotone"
              dataKey="men"
              name="Men"
              stroke={CHART_COLORS.men}
              strokeWidth={2.5}
              dot={{ r: 5, fill: CHART_COLORS.men }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="women"
              name="Women"
              stroke={CHART_COLORS.women}
              strokeWidth={2.5}
              dot={{ r: 5, fill: CHART_COLORS.women }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="all"
              name="All"
              stroke={CHART_COLORS.all}
              strokeWidth={3}
              dot={{ r: 5, fill: CHART_COLORS.all }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-gray mt-1">Daily Net Income</p>
    </div>
  );
}
