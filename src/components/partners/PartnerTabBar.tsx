"use client";

import clsx from "clsx";

interface Partner {
  id: string;
  name: string;
}

interface PartnerTabBarProps {
  partners: Partner[];
  selected: string[];
  onToggle: (id: string) => void;
  maxSelected?: number;
}

export default function PartnerTabBar({
  partners,
  selected,
  onToggle,
}: PartnerTabBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {partners.map((partner) => {
        const isActive = selected.includes(partner.id);
        return (
          <button
            key={partner.id}
            onClick={() => onToggle(partner.id)}
            className={clsx(
              "px-5 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-plum text-white shadow-md"
                : "bg-surface-alt text-gray hover:bg-surface hover:text-title"
            )}
          >
            {isActive && (
              <span className="mr-1.5">&#10003;</span>
            )}
            {partner.name}
          </button>
        );
      })}
    </div>
  );
}
