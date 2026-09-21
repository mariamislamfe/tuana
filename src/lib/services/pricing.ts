import type { CartLine } from "@/lib/store/cart-store";

/** A validated coupon as the cart needs it — safe to hold on the client. */
export interface CouponDef {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderValue?: number;
}

export interface PricingRules {
  freeShippingThreshold: number;
  flatShippingRate: number;
  /** percent, e.g. 8.25 */
  taxRate: number;
}

export const DEFAULT_RULES: PricingRules = { freeShippingThreshold: 3000, flatShippingRate: 60, taxRate: 14 };
export const EXPRESS_SHIPPING = 150;

export function calculateTotals(items: Pick<CartLine, "price" | "quantity">[], coupon: CouponDef | null, rules: PricingRules = DEFAULT_RULES) {
  const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0));

  let discount = 0;
  let freeShippingFromCoupon = false;
  if (coupon && (!coupon.minOrderValue || subtotal >= coupon.minOrderValue)) {
    if (coupon.type === "percentage") discount = round2((subtotal * coupon.value) / 100);
    else if (coupon.type === "fixed") discount = Math.min(coupon.value, subtotal);
    else freeShippingFromCoupon = true;
  }

  const shipping = subtotal - discount >= rules.freeShippingThreshold || freeShippingFromCoupon || items.length === 0 ? 0 : rules.flatShippingRate;
  const tax = round2((subtotal - discount) * (rules.taxRate / 100));
  const total = round2(subtotal - discount + shipping + tax);

  return { subtotal, discount, shipping, tax, total, freeShippingThreshold: rules.freeShippingThreshold };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
