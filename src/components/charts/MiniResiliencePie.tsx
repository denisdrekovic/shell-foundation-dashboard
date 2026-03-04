"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ResilienceSlice } from "@/types/partner";

interface MiniResiliencePieProps {
  data: ResilienceSlice[];
}

export default function MiniResiliencePie({ data }: MiniResiliencePieProps) {
  return (
    <div className="h-16 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={14}
            outerRadius={28}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, entry) => [
              `${value}%`,
              (entry.payload as Record<string, unknown>)?.label as string ?? "",
            ]}
            contentStyle={{ fontSize: 10, borderRadius: 8, padding: "4px 8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
