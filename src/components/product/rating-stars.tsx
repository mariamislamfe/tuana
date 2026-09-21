import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={filled ? "fill-ink text-ink" : "fill-transparent text-line-strong"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
