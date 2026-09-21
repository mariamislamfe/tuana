import "server-only";
import { db } from "@/lib/db";
import type { Coupon } from "@/lib/types";
import type { CouponInput } from "@/lib/data/coupons";
import type { CouponDef } from "./pricing";

export async function listCoupons() {
  return db().coupons.list();
}

export async function findCoupon(code: string) {
  const wanted = code.trim().toLowerCase();
  return (await db().coupons.list()).find((c) => c.code.toLowerCase() === wanted) ?? null;
}

export async function createCoupon(input: CouponInput): Promise<Coupon> {
  const coupon: Coupon = {
    id: `coupon-${Date.now().toString(36)}`,
    code: input.code.trim().toUpperCase(),
    type: input.type,
    value: input.value,
    minOrderValue: input.minOrderValue,
    appliesTo: "all",
    startsAt: new Date().toISOString(),
    endsAt: input.endsAt,
    usedCount: 0,
    status: "active",
  };
  await db().coupons.upsert(coupon);
  return coupon;
}

export async function setCouponStatus(id: string, status: Coupon["status"]) {
  const coupon = (await db().coupons.list()).find((c) => c.id === id);
  if (!coupon) return null;
  const updated = { ...coupon, status };
  await db().coupons.upsert(updated);
  return updated;
}

export async function removeCoupon(id: string) {
  await db().coupons.remove(id);
}

export interface CouponCheck {
  valid: boolean;
  message?: string;
  coupon?: CouponDef;
}

/** Single source of truth for whether a code can be used on a given subtotal. */
export async function checkCoupon(code: string, subtotal: number): Promise<CouponCheck> {
  const coupon = await findCoupon(code);
  if (!coupon) return { valid: false, message: "That code isn't valid." };
  if (coupon.status === "expired") return { valid: false, message: "That code has expired." };
  if (coupon.status === "disabled") return { valid: false, message: "That code is no longer active." };
  if (coupon.status === "scheduled") return { valid: false, message: "That code isn't active yet." };
  if (coupon.endsAt && new Date(coupon.endsAt).getTime() < Date.now()) return { valid: false, message: "That code has expired." };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { valid: false, message: "That code has been fully used." };
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { valid: false, message: 'Add $' + (coupon.minOrderValue - subtotal).toFixed(2) + ' more to use this code.' };
  }
  return { valid: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, minOrderValue: coupon.minOrderValue } };
}
