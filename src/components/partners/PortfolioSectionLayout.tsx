"use client";

import { useState } from "react";
import PartnerTabBar from "./PartnerTabBar";
import PartnerPanel from "./PartnerPanel";
import { PartnerData } from "@/types/partner";

interface PortfolioSectionLayoutProps {
  partners: PartnerData[];
}

export default function PortfolioSectionLayout({
  partners,
}: PortfolioSectionLayoutProps) {
  const [selected, setSelected] = useState<string[]>(
    partners.length > 0 ? [partners[0].id] : []
  );

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        // Don't allow deselecting if only one selected
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== id);
      }
      // Max 2 selected: dequeue oldest
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const selectedPartners = partners.filter((p) => selected.includes(p.id));

  return (
    <div>
      <PartnerTabBar
        partners={partners.map((p) => ({ id: p.id, name: p.name }))}
        selected={selected}
        onToggle={handleToggle}
        maxSelected={2}
      />

      <div
        className={
          selectedPartners.length === 2
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : ""
        }
      >
        {selectedPartners.map((partner) => (
          <PartnerPanel key={partner.id} data={partner} />
        ))}
      </div>
    </div>
  );
}
