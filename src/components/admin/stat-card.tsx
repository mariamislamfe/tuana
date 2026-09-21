import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  deltaGoodDirection = "up",
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaGoodDirection?: "up" | "down";
  icon?: LucideIcon;
}) {
  const isUp = typeof delta === "number" && delta >= 0;
  const isGood = typeof delta === "number" && (deltaGoodDirection === "up" ? isUp : !isUp);

  return (
    <div className="rounded-md border border-line bg-paper-raised p-5">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] text-ink-3">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-ink-3" strokeWidth={1.5} />}
      </div>
      <p className="mt-2 text-[26px] font-medium leading-none text-ink">{value}</p>
      {typeof delta === "number" && (
        <div className={cn("mt-2.5 flex items-center gap-1 text-[12.5px] font-medium", isGood ? "text-success" : "text-danger")}>
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta)}%
          <span className="font-normal text-ink-3">vs prior period</span>
        </div>
      )}
    </div>
  );
}
