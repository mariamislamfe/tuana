import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./order-status-badge";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
            <th className="pb-2.5 font-medium">Order</th>
            <th className="pb-2.5 font-medium">Customer</th>
            <th className="pb-2.5 font-medium">Date</th>
            <th className="pb-2.5 font-medium">Status</th>
            <th className="pb-2.5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((o) => (
            <tr key={o.id} className="group">
              <td className="py-3">
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink group-hover:underline">
                  {o.number}
                </Link>
              </td>
              <td className="py-3 text-ink-2">{o.customerName}</td>
              <td className="py-3 text-ink-3">{formatDate(o.createdAt)}</td>
              <td className="py-3"><OrderStatusBadge status={o.status} /></td>
              <td className="py-3 text-right font-medium text-ink">{formatCurrency(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
