"use client";

import { useState, useCallback, ReactNode } from "react";
import { BarChart3, Table2, Download, Maximize2 } from "lucide-react";
import ChartExpandModal from "@/components/charts/ChartExpandModal";
import { downloadCSV } from "@/lib/csvHelpers";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  tableView?: ReactNode;
  csvData?: Record<string, string | number>[];
  csvFilename?: string;
  className?: string;
  height?: number;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  tableView,
  csvData,
  csvFilename,
  className = "",
  height,
}: ChartContainerProps) {
  const [showTable, setShowTable] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExport = useCallback(() => {
    if (csvData && csvFilename) {
      downloadCSV(csvData, csvFilename);
    }
  }, [csvData, csvFilename]);

  return (
    <>
      <div
        className={`bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] ${className}`}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-surface-alt)",
          }}
        >
          <div className="min-w-0">
            <h3
              className="text-xs font-semibold uppercase tracking-wider truncate"
              style={{ color: "var(--color-title)" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className="text-[10px] mt-0.5 truncate"
                style={{ color: "var(--color-gray)" }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-3 shrink-0">
            {/* Table / Chart toggle */}
            {tableView && (
              <button
                onClick={() => setShowTable(!showTable)}
                className="p-1.5 rounded-lg transition-colors hover:bg-surface-alt"
                aria-label={showTable ? "Show chart view" : "Show table view"}
                title={showTable ? "Show chart" : "Show table"}
                style={{ color: showTable ? "var(--color-plum)" : "var(--color-gray)" }}
              >
                {showTable ? <BarChart3 size={15} /> : <Table2 size={15} />}
              </button>
            )}

            {/* Download CSV */}
            {csvData && csvData.length > 0 && (
              <button
                onClick={handleExport}
                className="p-1.5 rounded-lg transition-colors hover:bg-surface-alt"
                aria-label="Download data as CSV"
                title="Download CSV"
                style={{ color: "var(--color-gray)" }}
              >
                <Download size={15} />
              </button>
            )}

            {/* Expand */}
            <button
              onClick={() => setExpanded(true)}
              className="p-1.5 rounded-lg transition-colors hover:bg-surface-alt"
              aria-label="Expand chart"
              title="Expand"
              style={{ color: "var(--color-gray)" }}
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4" style={height ? { height } : undefined}>
          {showTable && tableView ? (
            <div className="animate-[fadeIn_0.2s_ease-out]">{tableView}</div>
          ) : (
            <div className="animate-[fadeIn_0.2s_ease-out]">{children}</div>
          )}
        </div>
      </div>

      {/* Expand modal */}
      {expanded && (
        <ChartExpandModal title={title} onClose={() => setExpanded(false)}>
          {children}
        </ChartExpandModal>
      )}
    </>
  );
}
