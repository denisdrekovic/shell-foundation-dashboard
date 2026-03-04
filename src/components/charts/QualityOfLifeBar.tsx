"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QualityOfLifeItem } from "@/types/partner";
import { CHART_COLORS } from "@/lib/colors";

interface QualityOfLifeBarProps {
  items: QualityOfLifeItem[];
  title?: string;
}

export default function QualityOfLifeBar({
  items,
  title,
}: QualityOfLifeBarProps) {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-title mb-4">
          {title}
        </h3>
      )}
      <p className="text-sm text-gray mb-4 italic">
        In the past year, my household was able to...
      </p>
      <div style={{ height: Math.max(200, items.length * 60 + 60) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#6D6A6A" }}
            />
            <YAxis
              type="category"
              dataKey="question"
              width={200}
              tick={{ fontSize: 11, fill: "#3D4043" }}
            />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value).toFixed(1)}%`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            {/* Legend rendered outside chart for proper ordering */}
            <Bar
              dataKey="stronglyAgree"
              name="Strongly Agree"
              stackId="qol"
              fill={CHART_COLORS.stronglyAgree}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="agree"
              name="Agree"
              stackId="qol"
              fill={CHART_COLORS.agree}
            />
            <Bar
              dataKey="disagree"
              name="Disagree"
              stackId="qol"
              fill={CHART_COLORS.disagree}
            />
            <Bar
              dataKey="stronglyDisagree"
              name="Strongly Disagree"
              stackId="qol"
              fill={CHART_COLORS.stronglyDisagree}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-2">
        {[
          { label: "Strongly Agree", color: CHART_COLORS.stronglyAgree },
          { label: "Agree", color: CHART_COLORS.agree },
          { label: "Disagree", color: CHART_COLORS.disagree },
          { label: "Strongly Disagree", color: CHART_COLORS.stronglyDisagree },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-gray">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
