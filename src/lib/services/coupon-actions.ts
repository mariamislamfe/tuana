"use server";

import { checkCoupon, type CouponCheck } from "./coupons-service";

export type { CouponCheck };

/** Runs on the server so coupons created in the dashboard work immediately. */
export async function validateCouponAction(code: string, subtotal: number): Promise<CouponCheck> {
  return checkCoupon(code, subtotal);
}
