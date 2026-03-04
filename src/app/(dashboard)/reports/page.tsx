"use client";

import { useState } from "react";
import ScorecardTable from "@/components/tables/ScorecardTable";
import ROITable from "@/components/tables/ROITable";
import scorecardData from "@/data/scorecard.json";
import roiData from "@/data/roi.json";
import clsx from "clsx";

type ReportTab = "scorecard" | "roi";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("scorecard");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[var(--font-heading)] text-title">
        Reports
      </h1>

      {/* Tab bar */}
      <div className="flex gap-2" role="tablist" aria-label="Report type">
        {([
          { id: "scorecard" as ReportTab, label: "Scorecard" },
          { id: "roi" as ReportTab, label: "Experimental ROI" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={clsx(
              "px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-plum/40",
              activeTab === tab.id
                ? "bg-plum text-white shadow-sm"
                : "bg-surface-alt text-gray hover:text-title hover:bg-surface"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "scorecard" ? (
        <div role="tabpanel" id="tabpanel-scorecard" aria-labelledby="tab-scorecard">
          <p className="text-body mb-4">
            We found that{" "}
            <span className="text-green font-semibold">7 out of 9 partners</span>{" "}
            achieved a median income uplift of more than 20%.
          </p>
          <ScorecardTable rows={scorecardData as any} />
        </div>
      ) : (
        <div role="tabpanel" id="tabpanel-roi" aria-labelledby="tab-roi">
          <p className="text-body mb-4">
            Return on investment estimates across all portfolio partners.
          </p>
          <ROITable rows={roiData as any} />
        </div>
      )}
    </div>
  );
}
