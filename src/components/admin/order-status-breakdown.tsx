import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusBreakdown({ data }: { data: { status: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-3.5">
      {sorted.map((d) => (
        <div key={d.status} className="flex items-center gap-3">
          <div className="w-28 shrink-0">
            <OrderStatusBadge status={d.status as OrderStatus} />
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-ink/70" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="w-6 shrink-0 text-right text-[12.5px] text-ink-2">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
