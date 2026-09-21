import type { Metadata } from "next";
import Image from "next/image";
import { AlertTriangle, XCircle } from "lucide-react";
import { inventoryRecords } from "@/lib/services/products-service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory — Admin" };

export default async function AdminInventoryPage() {
  const records = (await inventoryRecords()).sort((a, b) => a.localStock - b.localStock);
  const lowStock = records.filter((r) => r.localStock > 0 && r.localStock <= r.lowStockThreshold).length;
  const outOfStock = records.filter((r) => r.localStock === 0).length;

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Inventory</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">{records.length} variants tracked across your catalog.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Total Variants</p>
          <p className="mt-1 text-lg font-medium text-ink">{records.length}</p>
        </div>
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Low Stock</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-medium text-warning">
            <AlertTriangle className="h-3.5 w-3.5" /> {lowStock}
          </p>
        </div>
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Out of Stock</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-medium text-danger">
            <XCircle className="h-3.5 w-3.5" /> {outOfStock}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-paper-raised scrollbar-thin">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {records.map((r) => (
              <tr key={r.variantId} className="hover:bg-surface/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-xs bg-surface">
                      <Image src={r.image} alt="" fill sizes="36px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-ink">{r.productTitle}</p>
                      {r.variantTitle && <p className="text-[12px] text-ink-3">{r.variantTitle}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-3">{r.sku}</td>
                <td className={cn("px-4 py-3 font-medium", r.localStock === 0 ? "text-danger" : r.localStock <= r.lowStockThreshold ? "text-warning" : "text-ink")}>
                  {r.localStock}
                </td>
                <td className="px-4 py-3">
                  {r.localStock === 0 ? (
                    <Badge variant="danger">Out of Stock</Badge>
                  ) : r.localStock <= r.lowStockThreshold ? (
                    <Badge variant="warning">Low Stock</Badge>
                  ) : (
                    <Badge variant="success">In Stock</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
