"use client";

import dynamic from "next/dynamic";
import { EnrichedGeoLocation } from "@/types/map";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-[var(--radius-card)] bg-surface-alt flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-plum border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray">Loading map...</span>
      </div>
    </div>
  ),
});

interface InteractiveMapProps {
  locations: EnrichedGeoLocation[];
  selectedPartnerId: string | null;
  onMarkerClick: (location: EnrichedGeoLocation) => void;
  gender: "all" | "men" | "women";
}

export default function InteractiveMap(props: InteractiveMapProps) {
  return <MapContent {...props} />;
}
