"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { IncomeTrajectoryPoint } from "@/types/analytics";
import { formatCurrency } from "@/lib/formatters";

interface ProjectedIncomeChartProps {
  data: IncomeTrajectoryPoint[];
  livingWage?: number;
  povertyLine?: number;
}

export default function ProjectedIncomeChart({
  data,
  livingWage = 7.5,
  povertyLine = 2.15,
}: ProjectedIncomeChartProps) {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.baseline, d.projected)),
    livingWage
  );

  return (
    <div
      className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4"
      role="img"
      aria-label={`Projected income trajectory chart. Baseline income: ${formatCurrency(data[0]?.baseline ?? 0)} per day. Projected income after 12 months: ${formatCurrency(data[data.length - 1]?.projected ?? 0)} per day. Living wage target: ${formatCurrency(livingWage)} per day.`}
    >
      <h3 className="text-xs font-semibold text-title uppercase tracking-wider mb-1">
        Projected Income Trajectory
      </h3>
      <p className="text-[10px] text-gray mb-3">
        12-month projection based on current parameter settings
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10 }}
              tickFormatter={(m) => `M${m}`}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
              domain={[0, maxVal * 1.15]}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value as number) + "/day",
              ]}
              labelFormatter={(m) => `Month ${m}`}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <ReferenceLine
              y={livingWage}
              stroke="#00A17D"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: "Living Wage",
                position: "right",
                fontSize: 9,
                fill: "#00A17D",
              }}
            />
            <ReferenceLine
              y={povertyLine}
              stroke="#DC2626"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: "Extreme Poverty",
                position: "right",
                fontSize: 9,
                fill: "#DC2626",
              }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#6D6A6A"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Baseline"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#2A1055"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#2A1055" }}
              activeDot={{ r: 5 }}
              name="Projected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
