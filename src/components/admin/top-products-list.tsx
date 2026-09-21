import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export function TopProductsList({ data }: { data: { productId: string; title: string; revenue: number; units: number; image: string }[] }) {
  if (data.length === 0) return <p className="py-6 text-center text-sm text-ink-3">No sales in this period yet.</p>;

  return (
    <div className="flex flex-col divide-y divide-line">
      {data.map((p, i) => (
        <div key={p.productId} className="flex items-center gap-3.5 py-3 first:pt-0">
          <span className="w-4 text-[12.5px] text-ink-3">{i + 1}</span>
          <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-xs bg-surface">
            <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-ink">{p.title}</p>
            <p className="text-[12px] text-ink-3">{p.units} units sold</p>
          </div>
          <p className="text-[13px] font-medium text-ink">{formatCurrency(p.revenue)}</p>
        </div>
      ))}
    </div>
  );
}
