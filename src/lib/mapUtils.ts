/**
 * Converts an income-to-living-wage ratio into a gradient color.
 * 0.0 → red (#DC2626), 0.5 → gold (#FFC000), 1.0+ → green (#00A17D)
 */
export function incomeToColor(ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));

  if (clamped <= 0.5) {
    // Red → Gold
    const t = clamped / 0.5;
    return interpolateColor("#DC2626", "#FFC000", t);
  } else {
    // Gold → Green
    const t = (clamped - 0.5) / 0.5;
    return interpolateColor("#FFC000", "#00A17D", t);
  }
}

function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Converts sample size to marker radius (px).
 * Range: 8px (smallest ~100) to 22px (largest ~550)
 */
export function markerRadius(sampleSize: number): number {
  const minSize = 80;
  const maxSize = 550;
  const minR = 8;
  const maxR = 22;

  const clamped = Math.max(minSize, Math.min(maxSize, sampleSize));
  const ratio = (clamped - minSize) / (maxSize - minSize);
  return Math.round(minR + ratio * (maxR - minR));
}

/**
 * Generate an array of gradient stops for the map legend.
 */
export function gradientStops(): { ratio: number; color: string; label: string }[] {
  return [
    { ratio: 0, color: incomeToColor(0), label: "0%" },
    { ratio: 0.25, color: incomeToColor(0.25), label: "25%" },
    { ratio: 0.5, color: incomeToColor(0.5), label: "50%" },
    { ratio: 0.75, color: incomeToColor(0.75), label: "75%" },
    { ratio: 1.0, color: incomeToColor(1.0), label: "100%" },
  ];
}
