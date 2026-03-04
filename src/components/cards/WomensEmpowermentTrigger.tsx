"use client";

import { EnrichedGeoLocation } from "@/types/map";
import { ChevronRight } from "lucide-react";

interface WomensEmpowermentTriggerProps {
  locations: EnrichedGeoLocation[];
  onClick: () => void;
  isActive: boolean;
}

export default function WomensEmpowermentTrigger({
  locations,
  onClick,
  isActive,
}: WomensEmpowermentTriggerProps) {
  if (locations.length === 0) return null;

  const totalWomen =
    locations.reduce((s, l) => s + l.endlineIncome.women, 0) / locations.length;
  const totalMen =
    locations.reduce((s, l) => s + l.endlineIncome.men, 0) / locations.length;
  const avgGap = ((1 - totalWomen / totalMen) * 100).toFixed(1);
  const countries = new Set(locations.map((l) => l.country)).size;

  return (
    <button
      onClick={onClick}
      aria-expanded={isActive}
      className={`w-full bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4 flex items-center gap-3 text-left transition-all hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus:ring-2 focus:ring-plum/40 ${
        isActive ? "ring-2 ring-plum/30 shadow-[var(--shadow-card-hover)]" : ""
      }`}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#910D6320" }}
      >
        <span className="text-lg">♀</span>
      </div>

      {/* Title + summary */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold font-[var(--font-heading)] text-title">
          Women&apos;s Economic Empowerment
        </h3>
        <p className="text-xs text-gray">
          <span className="font-semibold text-plum">{avgGap}%</span> avg gender
          gap &middot; {countries} countries &middot; {locations.length} partners
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={18}
        className={`text-gray shrink-0 transition-transform ${isActive ? "rotate-90 text-plum" : ""}`}
      />
    </button>
  );
}
