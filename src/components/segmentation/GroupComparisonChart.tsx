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
import { formatCurrency } from "@/lib/formatters";

interface GroupData {
  name: string;
  avgIncome: number;
  avgMen: number;
  avgWomen: number;
  avgRatio: number;
  count: number;
  color: string;
}

interface GroupComparisonChartProps {
  groups: GroupData[];
  metric: "income" | "ratio";
  title: string;
}

export default function GroupComparisonChart({
  groups,
  metric,
  title,
}: GroupComparisonChartProps) {
  if (groups.length === 0) return null;

  if (metric === "ratio") {
    return (
      <div
        role="img"
        aria-label={`${title} chart comparing ${groups.map((g) => g.name).join(", ")} by living wage percentage.`}
      >
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={groups}
              margin={{ top: 5, right: 40, bottom: 5, left: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EDEBEF"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6D6A6A" }}
                axisLine={{ stroke: "#EDEBEF" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6D6A6A" }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${(value as number).toFixed(0)}%`,
                  "of Living Wage",
                ]}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <ReferenceLine
                y={100}
                stroke="#6BA58E"
                strokeDasharray="6 3"
                strokeOpacity={0.6}
                label={{
                  value: "Living Wage",
                  position: "right",
                  fontSize: 9,
                  fill: "#6BA58E",
                }}
              />
              <Bar
                dataKey="avgRatio"
                name="% of Living Wage"
                radius={[6, 6, 0, 0]}
                barSize={36}
              >
                {groups.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Income chart
  return (
    <div
      role="img"
      aria-label={`${title} chart comparing ${groups.map((g) => g.name).join(", ")} by average income.`}
    >
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={groups}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EDEBEF"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#6D6A6A" }}
              axisLine={{ stroke: "#EDEBEF" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6D6A6A" }}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value as number) + "/day",
                "Avg Income",
              ]}
              contentStyle={{
                fontSize: 11,
                borderRadius: 10,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="avgIncome"
              name="Avg Income"
              radius={[6, 6, 0, 0]}
              barSize={36}
            >
              {groups.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
