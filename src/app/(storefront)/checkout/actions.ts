"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { placeOrder, type PlaceOrderInput } from "@/lib/services/checkout-service";

export interface PlacedOrder {
  number: string;
  email: string;
  name: string;
  items: { title: string; variantTitle: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export type PlaceOrderActionResult = { ok: true; order: PlacedOrder } | { ok: false; message: string };

export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderActionResult> {
  const user = await getCurrentUser("customer");

  const result = await placeOrder(input, user?.id ?? null);
  if (!result.ok) return result;

  revalidatePath("/admin", "layout");
  const o = result.order;
  return {
    ok: true,
    order: {
      number: o.number,
      email: o.email,
      name: o.customerName,
      items: o.items.map((i) => ({ title: i.title, variantTitle: i.variantTitle, quantity: i.quantity, price: i.price, image: i.image })),
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shippingCost,
      tax: o.tax,
      total: o.total,
    },
  };
}
