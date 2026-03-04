import { incomeToColor } from "@/lib/mapUtils";

export default function MapLegend() {
  // Generate gradient stops
  const stops = Array.from({ length: 11 }, (_, i) => {
    const ratio = i / 10;
    return { ratio, color: incomeToColor(ratio) };
  });

  const gradientCSS = `linear-gradient(to right, ${stops.map((s) => s.color).join(", ")})`;

  return (
    <div
      className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 pointer-events-auto max-w-[260px]"
      role="img"
      aria-label="Map legend: marker color represents income as percentage of living wage from 0% (red) to 100%+ (green). Marker size represents sample size."
    >
      {/* Color gradient */}
      <p className="text-[9px] text-gray font-medium mb-1">
        Color: % of Living Wage
      </p>
      <div
        className="h-2 rounded-full w-full"
        style={{ background: gradientCSS }}
        aria-hidden="true"
      />
      <div className="flex justify-between mt-0.5 mb-2">
        <span className="text-[8px] text-gray">0%</span>
        <span className="text-[8px] text-gray">50%</span>
        <span className="text-[8px] text-gray">100%+</span>
      </div>

      {/* Marker size — compact inline */}
      <div className="flex items-center gap-2 border-t border-surface-alt pt-1.5">
        <span className="text-[9px] text-gray font-medium">Size:</span>
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {[
            { label: "100", r: 5 },
            { label: "300", r: 8 },
            { label: "500", r: 11 },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div
                className="rounded-full bg-gray/30 border border-gray/40"
                style={{ width: item.r * 2, height: item.r * 2 }}
              />
              <span className="text-[7px] text-gray mt-0.5">n≈{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
