"use client";

import { ROIRow } from "@/types/scorecard";
import { formatCurrency, formatNumber, formatCompact } from "@/lib/formatters";
import { Download } from "lucide-react";

interface ROITableProps {
  rows: ROIRow[];
}

function downloadCSV(rows: ROIRow[]) {
  const headers = [
    "Portfolio",
    "Partner",
    "Country",
    "Intervention",
    "Avg Net Income Uplift per Client",
    "Cumulative Client Total",
    "Cumulative Investment",
    "Cumulative ROI",
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.portfolio,
        r.partner,
        r.country,
        r.intervention,
        r.avgNetIncomeUpliftPerClient,
        r.cumulativeClientTotal,
        r.cumulativeInvestment,
        r.cumulativeROI,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "experimental-roi.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ROITable({ rows }: ROITableProps) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => downloadCSV(rows)}
          className="flex items-center gap-2 px-4 py-2 bg-deep-purple text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-plum transition-colors"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-deep-purple text-white">
              <th className="px-4 py-3 text-left font-semibold">Portfolio</th>
              <th className="px-4 py-3 text-left font-semibold">Partner</th>
              <th className="px-4 py-3 text-left font-semibold">Country</th>
              <th className="px-4 py-3 text-left font-semibold">
                Intervention
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Avg Uplift/Client
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Cumulative Clients
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Cumulative Investment
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Cumulative ROI
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-surface-alt transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <td className="px-4 py-3 text-body capitalize">
                  {row.portfolio.replace("-", " ")}
                </td>
                <td className="px-4 py-3 font-medium text-title">
                  {row.partner}
                </td>
                <td className="px-4 py-3 text-body">{row.country}</td>
                <td className="px-4 py-3 text-body">{row.intervention}</td>
                <td className="px-4 py-3 text-right text-body">
                  {formatCurrency(row.avgNetIncomeUpliftPerClient)}
                </td>
                <td className="px-4 py-3 text-right text-body">
                  {formatNumber(row.cumulativeClientTotal)}
                </td>
                <td className="px-4 py-3 text-right text-body">
                  {formatCompact(row.cumulativeInvestment)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green">
                  {row.cumulativeROI.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
