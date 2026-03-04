"use client";

import { useState } from "react";
import { CHART_COLORS } from "@/lib/colors";
import { PortfolioCategory } from "@/types/partner";

interface GeoLocation {
  partnerId: string;
  partnerName: string;
  portfolio: PortfolioCategory;
  country: string;
  coordinates: [number, number];
  sampleSize: number;
}

interface GeographicMapProps {
  locations: GeoLocation[];
}

// Simple Mercator projection for the relevant region (Africa + South Asia)
function project(
  lon: number,
  lat: number,
  width: number,
  height: number
): [number, number] {
  const x = ((lon + 30) / 130) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN / Math.PI) * (height / 2) * 0.8;
  return [x, y];
}

const CATEGORY_COLORS = CHART_COLORS.categories;

// Simplified world outline paths for Africa, India, Middle East region
const LAND_PATHS = [
  // Africa simplified
  "M 80,100 L 95,85 L 115,80 L 130,82 L 145,90 L 155,105 L 160,120 L 165,140 L 170,160 L 168,180 L 160,200 L 150,215 L 135,225 L 120,230 L 105,225 L 95,210 L 85,195 L 75,180 L 70,165 L 68,150 L 70,135 L 72,120 L 75,110 Z",
  // Arabian Peninsula
  "M 155,90 L 175,85 L 190,90 L 195,105 L 185,115 L 170,118 L 160,110 Z",
  // India
  "M 210,80 L 225,75 L 240,80 L 255,85 L 260,100 L 258,120 L 250,140 L 238,155 L 225,145 L 215,130 L 210,115 L 208,100 Z",
  // Southeast Asia
  "M 260,90 L 275,85 L 280,95 L 275,105 L 265,100 Z",
];

export default function GeographicMap({ locations }: GeographicMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const width = 340;
  const height = 280;

  return (
    <div>
      <h3 className="text-lg font-semibold font-[var(--font-heading)] text-title mb-4">
        Geographic Distribution of Assessments
      </h3>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Background */}
          <rect width={width} height={height} fill="#F5F3F7" rx="8" />

          {/* Land masses */}
          {LAND_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="#EDEBEF"
              stroke="#FAFAFA"
              strokeWidth={1}
            />
          ))}

          {/* Location markers */}
          {locations.map((loc) => {
            const [x, y] = project(loc.coordinates[0], loc.coordinates[1], width, height);
            const color =
              CATEGORY_COLORS[loc.portfolio as keyof typeof CATEGORY_COLORS];
            const isHovered = hoveredId === loc.partnerId;
            const radius = Math.max(6, Math.min(12, loc.sampleSize / 50));

            return (
              <g
                key={loc.partnerId}
                onMouseEnter={() => setHoveredId(loc.partnerId)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 4}
                  fill={color}
                  opacity={isHovered ? 0.2 : 0.1}
                  className="transition-opacity duration-200"
                />
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={color}
                  stroke="white"
                  strokeWidth={2}
                  opacity={0.9}
                  className="transition-all duration-200"
                />
                {/* Label on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 60}
                      y={y - 38}
                      width={120}
                      height={28}
                      rx={6}
                      fill="#2B2D2E"
                      opacity={0.9}
                    />
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight={500}
                    >
                      {loc.partnerName} ({loc.country})
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex gap-4 mt-3 justify-center">
          {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray capitalize">
                {key.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
