import { Check, User, Truck as TruckIcon, Cog } from "lucide-react";
import type { OrderEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACTOR_ICON = { system: Cog, admin: User, customer: User, supplier: TruckIcon };

export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((e, i) => {
        const Icon = ACTOR_ICON[e.actor];
        const isLast = i === events.length - 1;
        return (
          <li key={e.id} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-ink-2">
                {isLast ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              {!isLast && <span className="my-1 w-px flex-1 bg-line" />}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p className="text-[13.5px] font-medium text-ink">{e.label}</p>
              {e.description && <p className="mt-0.5 text-[12.5px] text-ink-3">{e.description}</p>}
              <p className="mt-0.5 text-[12px] text-ink-3">{formatDateTime(e.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
