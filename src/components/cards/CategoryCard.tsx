import { Sprout, Truck, Store, LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

const ICON_MAP: Record<string, LucideIcon> = {
  sprout: Sprout,
  truck: Truck,
  store: Store,
};

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  sprout: { bg: "bg-green-tint", icon: "text-green" },
  truck: { bg: "bg-purple-tint", icon: "text-plum" },
  store: { bg: "bg-gold-tint", icon: "text-deep-purple" },
};

interface CategoryCardProps {
  label: string;
  achieved: number;
  total: number;
  icon: string;
}

export default function CategoryCard({
  label,
  achieved,
  total,
  icon,
}: CategoryCardProps) {
  const IconComponent = ICON_MAP[icon] || Store;
  const colors = COLOR_MAP[icon] || COLOR_MAP.store;

  return (
    <Card className="flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-[var(--radius-card)] ${colors.bg} flex items-center justify-center flex-shrink-0`}
      >
        <IconComponent className={`w-7 h-7 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-3xl font-bold font-[var(--font-heading)] text-title">
          <span className="text-green">{achieved}</span>
          <span className="text-gray mx-1">/</span>
          {total}
        </p>
        <p className="text-sm text-gray mt-0.5">{label}</p>
        <p className="text-xs text-gray/60">
          achieved {"\u2265"} 20% median uplift
        </p>
      </div>
    </Card>
  );
}
