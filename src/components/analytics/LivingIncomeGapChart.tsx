"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { WaterfallSegment } from "@/types/analytics";
import { formatCurrency } from "@/lib/formatters";

interface LivingIncomeGapChartProps {
  data: WaterfallSegment[];
  livingWage?: number;
}

export default function LivingIncomeGapChart({
  data,
  livingWage = 7.5,
}: LivingIncomeGapChartProps) {
  // Convert waterfall to stacked bar format
  const chartData = data.map((seg) => ({
    name: seg.name,
    invisible: Math.min(seg.start, seg.end),
    value: Math.abs(seg.end - seg.start),
    fill: seg.fill,
    rawValue: seg.value,
  }));

  return (
    <div
      className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4"
      role="img"
      aria-label={`Waterfall chart showing income drivers. Living wage target: ${formatCurrency(livingWage)} per day.`}
    >
      <h3 className="text-xs font-semibold text-title uppercase tracking-wider mb-1">
        Living Income Gap Waterfall
      </h3>
      <p className="text-[10px] text-gray mb-3">
        Contribution of each driver to closing the living income gap
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#6D6A6A" }}
              interval={0}
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
              formatter={(value, name) => {
                if (name === "invisible") return [null, null];
                return [formatCurrency(value as number) + "/day"];
              }}
              contentStyle={{
                fontSize: 11,
                borderRadius: 10,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <ReferenceLine
              y={livingWage}
              stroke="#00A17D"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: `Living Wage: ${formatCurrency(livingWage)}`,
                position: "right",
                fontSize: 9,
                fill: "#00A17D",
              }}
            />
            <Bar dataKey="invisible" stackId="stack" fill="transparent" />
            <Bar dataKey="value" stackId="stack" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
