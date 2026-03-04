"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface MiniSparklineProps {
  baseline: number;
  endline: number;
  livingWage: number;
  color?: string;
}

export default function MiniSparkline({
  baseline,
  endline,
  livingWage,
  color = "#2A1055",
}: MiniSparklineProps) {
  const data = [
    { name: "Baseline", value: baseline },
    { name: "Endline", value: endline },
  ];

  const maxY = Math.max(endline, livingWage) * 1.15;

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis domain={[0, maxY]} hide />
          <XAxis dataKey="name" hide />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number) + "/day", "Income"]}
            labelStyle={{ fontSize: 10 }}
            contentStyle={{ fontSize: 10, borderRadius: 8, padding: "4px 8px" }}
          />
          <ReferenceLine
            y={livingWage}
            stroke="#DC2626"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
