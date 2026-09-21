"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createCoupon, setCouponStatus, removeCoupon } from "@/lib/services/coupons-service";
import type { CouponInput } from "@/lib/data/coupons";

export async function createCouponAction(formData: FormData) {
  await requireAdmin();
  const input: CouponInput = {
    code: String(formData.get("code") ?? "").trim(),
    type: (formData.get("type") as CouponInput["type"]) ?? "percentage",
    value: Number(formData.get("value") ?? 0),
    minOrderValue: formData.get("minOrderValue") ? Number(formData.get("minOrderValue")) : undefined,
    endsAt: formData.get("endsAt") ? new Date(String(formData.get("endsAt"))).toISOString() : undefined,
  };
  await createCoupon(input);
  revalidatePath("/admin/marketing");
}

export async function toggleCouponStatusAction(id: string, status: "active" | "disabled") {
  await requireAdmin();
  await setCouponStatus(id, status);
  revalidatePath("/admin/marketing");
}

export async function deleteCouponAction(id: string) {
  await requireAdmin();
  await removeCoupon(id);
  revalidatePath("/admin/marketing");
}
