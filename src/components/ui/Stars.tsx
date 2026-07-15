import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Rated ${rating} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={1.4}
            className={cn(
              filled ? "fill-brass-500 text-brass-500" : "fill-transparent text-stone-300",
            )}
          />
        );
      })}
    </span>
  );
}
