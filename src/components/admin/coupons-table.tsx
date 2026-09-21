"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, MoreHorizontal, Power } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CouponFormDialog } from "./coupon-form-dialog";
import { toggleCouponStatusAction, deleteCouponAction } from "@/app/admin/(dashboard)/marketing/actions";
import { toast } from "@/lib/store/toast-store";

const STATUS_VARIANT = { active: "success", scheduled: "info", expired: "neutral", disabled: "warning" } as const;

function describeDiscount(c: Coupon) {
  if (c.type === "percentage") return `${c.value}% off`;
  if (c.type === "fixed") return `${formatCurrency(c.value)} off`;
  return "Free shipping";
}

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> Create Coupon
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-paper-raised scrollbar-thin">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Min. Order</th>
              <th className="px-4 py-3 font-medium">Used</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-surface/60">
                <td className="px-4 py-3 font-medium text-ink">{c.code}</td>
                <td className="px-4 py-3 text-ink-2">{describeDiscount(c)}</td>
                <td className="px-4 py-3 text-ink-2">{c.minOrderValue ? formatCurrency(c.minOrderValue) : "—"}</td>
                <td className="px-4 py-3 text-ink-2">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="px-4 py-3 text-ink-3">{c.endsAt ? formatDate(c.endsAt) : "No expiry"}</td>
                <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[c.status]} className="capitalize">{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-xs hover:bg-surface">
                      <MoreHorizontal className="h-4 w-4 text-ink-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => startTransition(async () => { await toggleCouponStatusAction(c.id, c.status === "active" ? "disabled" : "active"); toast({ title: "Coupon updated", variant: "success" }); })}
                        className="flex items-center gap-2"
                      >
                        <Power className="h-3.5 w-3.5" /> {c.status === "active" ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => startTransition(async () => { await deleteCouponAction(c.id); toast({ title: "Coupon deleted", variant: "success" }); })}
                        className="flex items-center gap-2 text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CouponFormDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
