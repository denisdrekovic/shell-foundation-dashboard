"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PovertyDistribution } from "@/types/analytics";

interface PovertyDistributionChartProps {
  data: PovertyDistribution[];
  numBeneficiaries: number;
}

export default function PovertyDistributionChart({
  data,
  numBeneficiaries,
}: PovertyDistributionChartProps) {
  return (
    <div
      className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4"
      role="img"
      aria-label={`Poverty distribution chart showing estimated distribution of ${numBeneficiaries.toLocaleString()} beneficiaries across income thresholds for baseline and projected scenarios.`}
    >
      <h3 className="text-xs font-semibold text-title uppercase tracking-wider mb-1">
        Poverty Distribution
      </h3>
      <p className="text-[10px] text-gray mb-3">
        Estimated distribution of {numBeneficiaries.toLocaleString()} beneficiaries
        across income thresholds
      </p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBEF" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar
              dataKey="belowExtremePoverty"
              stackId="a"
              fill="#DC2626"
              name="Below Extreme Poverty"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="belowPovertyLine"
              stackId="a"
              fill="#FFA500"
              name="Below Poverty Line"
            />
            <Bar
              dataKey="belowLivingWage"
              stackId="a"
              fill="#FFC000"
              name="Below Living Wage"
            />
            <Bar
              dataKey="aboveLivingWage"
              stackId="a"
              fill="#00A17D"
              name="Above Living Wage"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
