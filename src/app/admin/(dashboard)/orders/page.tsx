import Link from "next/link";
import type { Metadata } from "next";
import { listOrders } from "@/lib/services/orders-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge, SupplierStatusBadge } from "@/components/admin/order-status-badge";
import { OrdersFilterBar } from "@/components/admin/orders-filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const orders = (await listOrders({
    status: (sp.status as OrderStatus | "all") ?? "all",
    query: typeof sp.q === "string" ? sp.q : undefined,
  }));

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Orders</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">{orders.length} orders</p>
      </div>

      <OrdersFilterBar />

      {orders.length === 0 ? (
        <EmptyState title="No orders found" description="Try a different search or status filter." />
      ) : (
        <div className="overflow-x-auto rounded-md border border-line bg-paper-raised scrollbar-thin">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Fulfillment</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:underline">
                      {o.number}
                    </Link>
                    <div className="mt-1"><OrderStatusBadge status={o.status} /></div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-ink-2">{o.customerName}</p>
                    <p className="text-[12px] text-ink-3">{o.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3.5 text-ink-2">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-4 py-3.5"><PaymentStatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3.5 capitalize text-ink-2">{o.fulfillmentStatus}</td>
                  <td className="px-4 py-3.5"><SupplierStatusBadge status={o.supplierStatus} /></td>
                  <td className="px-4 py-3.5 text-right font-medium text-ink">{formatCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
