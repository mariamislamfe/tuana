import type { Metadata } from "next";
import { listCoupons } from "@/lib/services/coupons-service";
import { CouponsTable } from "@/components/admin/coupons-table";

export const metadata: Metadata = { title: "Marketing — Admin" };

export default async function AdminMarketingPage() {
  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Marketing</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">Coupons and discount codes.</p>
      </div>
      <CouponsTable coupons={await listCoupons()} />
    </div>
  );
}
