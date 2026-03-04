"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { EnrichedGeoLocation } from "@/types/map";
import { incomeToColor, markerRadius } from "@/lib/mapUtils";
import { formatCurrency } from "@/lib/formatters";
import "leaflet/dist/leaflet.css";

interface MapContentProps {
  locations: EnrichedGeoLocation[];
  selectedPartnerId: string | null;
  onMarkerClick: (location: EnrichedGeoLocation) => void;
  gender: "all" | "men" | "women";
}

function MapBoundsUpdater({ locations }: { locations: EnrichedGeoLocation[] }) {
  const map = useMap();

  if (locations.length > 0) {
    const lats = locations.map((l) => l.coordinates[1]);
    const lngs = locations.map((l) => l.coordinates[0]);
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats) - 5, Math.min(...lngs) - 10],
      [Math.max(...lats) + 5, Math.max(...lngs) + 10],
    ];
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
  }

  return null;
}

export default function MapContent({
  locations,
  selectedPartnerId,
  onMarkerClick,
  gender,
}: MapContentProps) {
  const getIncome = (loc: EnrichedGeoLocation) => {
    if (gender === "men") return loc.endlineIncome.men;
    if (gender === "women") return loc.endlineIncome.women;
    return loc.endlineIncome.all;
  };

  return (
    <MapContainer
      center={[5, 40]}
      zoom={3}
      scrollWheelZoom={true}
      className="h-full w-full rounded-[var(--radius-card)]"
      style={{ minHeight: "500px", background: "#f0f0f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapBoundsUpdater locations={locations} />

      {locations.map((loc) => {
        const income = getIncome(loc);
        const ratio = income / loc.livingWage;
        const color = incomeToColor(ratio);
        const radius = markerRadius(loc.sampleSize);
        const isSelected = loc.partnerId === selectedPartnerId;

        return (
          <CircleMarker
            key={loc.partnerId}
            center={[loc.coordinates[1], loc.coordinates[0]]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: isSelected ? 0.95 : 0.75,
              color: isSelected ? "#2A1055" : "#ffffff",
              weight: isSelected ? 3 : 2,
              opacity: 1,
            }}
            eventHandlers={{
              click: () => onMarkerClick(loc),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -radius]}
              opacity={0.95}
            >
              <div className="text-xs font-medium">
                <p className="font-bold text-sm">{loc.partnerName}</p>
                <p className="text-gray-600">{loc.country} &middot; {loc.asset}</p>
                <div className="mt-1 border-t pt-1">
                  <p>
                    Income: <span className="font-bold">{formatCurrency(income)}/day</span>
                    {gender !== "all" && (
                      <span className="text-gray-400 ml-1">({gender})</span>
                    )}
                  </p>
                  <p>
                    Living wage: {formatCurrency(loc.livingWage)}/day
                  </p>
                  <p>
                    Gap: <span className="font-bold" style={{ color }}>{Math.round(ratio * 100)}%</span> of living wage
                  </p>
                </div>
                {gender === "all" && (
                  <div className="mt-1 border-t pt-1 flex gap-3">
                    <span style={{ color: "#2A1055" }}>&#9794; {formatCurrency(loc.endlineIncome.men)}</span>
                    <span style={{ color: "#910D63" }}>&#9792; {formatCurrency(loc.endlineIncome.women)}</span>
                  </div>
                )}
                <p className="mt-1 text-gray-400">n = {loc.sampleSize} &middot; Click for details</p>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
