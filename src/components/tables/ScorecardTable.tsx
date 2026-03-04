"use client";

import { ScorecardRow } from "@/types/scorecard";
import clsx from "clsx";

interface ScorecardTableProps {
  rows: ScorecardRow[];
}

function getUpliftColor(value: number | null): string {
  if (value === null) return "";
  return value >= 20 ? "bg-green-tint text-green" : "bg-[#FCE4EC] text-plum";
}

function getProportionColor(value: number | null): string {
  if (value === null) return "";
  return value >= 0.5 ? "bg-green-tint text-green" : "bg-[#FCE4EC] text-plum";
}

export default function ScorecardTable({ rows }: ScorecardTableProps) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-deep-purple text-white">
            <th className="px-4 py-3 text-left font-semibold">
              Evaluation Partner
            </th>
            <th className="px-4 py-3 text-left font-semibold">Portfolio</th>
            <th className="px-4 py-3 text-left font-semibold">Partner</th>
            <th className="px-4 py-3 text-left font-semibold">Country</th>
            <th className="px-4 py-3 text-left font-semibold">Asset</th>
            <th className="px-4 py-3 text-right font-semibold">Sample Size</th>
            <th className="px-4 py-3 text-right font-semibold">Mean Uplift</th>
            <th className="px-4 py-3 text-right font-semibold">
              Median Uplift
            </th>
            <th className="px-4 py-3 text-right font-semibold">
              % Achieving {">"}20%
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={clsx(
                "border-b border-surface-alt transition-colors",
                i % 2 === 0 ? "bg-white" : "bg-surface"
              )}
            >
              <td className="px-4 py-3 text-body">{row.evaluationPartner}</td>
              <td className="px-4 py-3 text-body capitalize">
                {row.portfolio.replace("-", " ")}
              </td>
              <td className="px-4 py-3 font-medium text-title">
                {row.partner}
              </td>
              <td className="px-4 py-3 text-body">{row.country}</td>
              <td className="px-4 py-3 text-body">{row.asset}</td>
              <td className="px-4 py-3 text-right text-body">
                {row.sampleSize}
              </td>
              <td
                className={clsx(
                  "px-4 py-3 text-right font-semibold rounded-sm",
                  row.meanUplift !== null && getUpliftColor(row.meanUplift)
                )}
              >
                {row.meanUplift !== null ? `${row.meanUplift.toFixed(1)}%` : "–"}
              </td>
              <td
                className={clsx(
                  "px-4 py-3 text-right font-semibold rounded-sm",
                  row.medianUplift !== null && getUpliftColor(row.medianUplift)
                )}
              >
                {row.medianUplift !== null
                  ? `${row.medianUplift.toFixed(1)}%`
                  : "–"}
              </td>
              <td
                className={clsx(
                  "px-4 py-3 text-right font-semibold rounded-sm",
                  row.proportionAbove20 !== null &&
                    getProportionColor(row.proportionAbove20)
                )}
              >
                {row.proportionAbove20 !== null
                  ? `${(row.proportionAbove20 * 100).toFixed(0)}%`
                  : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
