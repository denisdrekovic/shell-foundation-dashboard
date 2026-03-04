"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ResilienceSlice } from "@/types/partner";

interface ResiliencePieProps {
  slices: ResilienceSlice[];
  title?: string;
}

const RADIAN = Math.PI / 180;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (value < 5) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${value.toFixed(1)}%`}
    </text>
  );
}

export default function ResiliencePie({ slices, title }: ResiliencePieProps) {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-title mb-2">
          {title}
        </h3>
      )}
      <p className="text-sm text-gray mb-4 italic">
        If faced with an unexpected expense, my household could manage it...
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={95}
              dataKey="value"
              nameKey="label"
              label={renderCustomLabel}
              labelLine={false}
            >
              {slices.map((slice, index) => (
                <Cell key={index} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
