import Card from "@/components/ui/Card";

interface HeroStatProps {
  achieved: number;
  total: number;
  threshold: string;
  metric: string;
}

export default function HeroStat({
  achieved,
  total,
  threshold,
  metric,
}: HeroStatProps) {
  return (
    <Card variant="hero" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-plum/20 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full translate-y-1/2 -translate-x-1/3" />
      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">
          2025 Rapid Impact Assessment
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-[var(--font-heading)] mb-3">
          <span className="text-gold">{achieved}</span> out of {total} partners
        </h1>
        <p className="text-white/80 text-lg">
          achieved a {metric} of{" "}
          <span className="text-green-tint font-semibold">
            {"\u2265"} {threshold}
          </span>
        </p>
      </div>
    </Card>
  );
}
