import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "hero";
}

export default function Card({
  children,
  className,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={clsx(
        "transition-shadow duration-200",
        {
          "bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6":
            variant === "default",
          "bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-elevated)] p-6":
            variant === "elevated",
          "bg-deep-purple text-white rounded-[var(--radius-card-lg)] shadow-[var(--shadow-elevated)] p-8":
            variant === "hero",
        },
        variant === "default" && "hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
    >
      {children}
    </div>
  );
}
