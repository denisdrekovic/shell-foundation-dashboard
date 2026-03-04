"use client";

import { usePathname } from "next/navigation";
import { useFilters } from "@/contexts/FilterContext";
import clsx from "clsx";

const COUNTRIES = ["India", "Kenya", "Rwanda", "Nigeria"];

const PARTNERS = [
  { id: "sistema-bio", name: "Sistema.bio" },
  { id: "s4s", name: "S4S" },
  { id: "sunculture", name: "Sunculture" },
  { id: "ampersand-rwanda", name: "Ampersand Rwanda" },
  { id: "m-kopa", name: "M-KOPA" },
  { id: "sidbi", name: "SIDBI" },
  { id: "keep-it-cool", name: "Keep IT Cool" },
  { id: "odyssey", name: "Odyssey" },
];

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analytics": "Predictive Analytics",
  "/segmentation": "Segmentation",
  "/reports": "Reports",
};

// Pages where global filters are wired in and functional
const FILTER_PAGES = new Set(["/dashboard", "/segmentation"]);
const GENDER_PAGES = new Set(["/segmentation"]);

export default function TopBar() {
  const pathname = usePathname();
  const { filters, setLocation, setPartnerId, setGender } = useFilters();

  const breadcrumb = BREADCRUMB_MAP[pathname] || "Dashboard";
  const showLocationFilters = FILTER_PAGES.has(pathname);
  const showGenderToggle = GENDER_PAGES.has(pathname);

  return (
    <header
      className="h-14 bg-white border-b border-surface-alt sticky top-0 z-40 flex items-center justify-between px-6 shrink-0"
      role="banner"
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <h1 className="text-sm font-semibold font-[var(--font-heading)] text-title">
          {breadcrumb}
        </h1>
      </nav>

      {/* Filters — only rendered on pages that use them */}
      <div className="flex items-center gap-3" role="toolbar" aria-label="Data filters">
        {showLocationFilters && (
          <>
            <label className="sr-only" htmlFor="filter-location">
              Filter by location
            </label>
            <select
              id="filter-location"
              value={filters.location || ""}
              onChange={(e) => setLocation(e.target.value || null)}
              className="text-xs border border-surface-alt rounded-[var(--radius-button)] px-2.5 py-1.5 bg-white text-body focus:outline-none focus:ring-2 focus:ring-plum/30"
            >
              <option value="">All Locations</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-partner">
              Filter by partner
            </label>
            <select
              id="filter-partner"
              value={filters.partnerId || ""}
              onChange={(e) => setPartnerId(e.target.value || null)}
              className="text-xs border border-surface-alt rounded-[var(--radius-button)] px-2.5 py-1.5 bg-white text-body focus:outline-none focus:ring-2 focus:ring-plum/30"
            >
              <option value="">All Partners</option>
              {PARTNERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </>
        )}

        {showGenderToggle && (
          <div
            className="flex bg-surface-alt rounded-[var(--radius-button)] p-0.5"
            role="radiogroup"
            aria-label="Gender filter"
          >
            {(["all", "men", "women"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                role="radio"
                aria-checked={filters.gender === g}
                className={clsx(
                  "px-2.5 py-1 rounded-[var(--radius-button)] text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-plum/40",
                  filters.gender === g
                    ? "bg-plum text-white shadow-sm"
                    : "text-gray hover:text-title"
                )}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
