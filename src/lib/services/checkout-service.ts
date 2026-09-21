import "server-only";
import { db } from "@/lib/db";
import type { Order, OrderItem, Address } from "@/lib/types";
import { calculateTotals, EXPRESS_SHIPPING } from "./pricing";
import { checkCoupon, findCoupon } from "./coupons-service";
import { getStoreSettings } from "./settings-service";

export interface PlaceOrderInput {
  items: { productId: string; variantId: string; quantity: number }[];
  couponCode?: string | null;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "paypal" | "apple_pay";
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
  country: string;
}

export type PlaceOrderResult =
  | { ok: true; order: Order }
  | { ok: false; message: string };

const PAYMENT_LABEL: Record<PlaceOrderInput["paymentMethod"], string> = {
  card: "Card",
  paypal: "PayPal",
  apple_pay: "Apple Pay",
};

/**
 * Builds an order the server can trust: prices, stock, coupon, shipping and
 * tax are all recomputed here from the database — nothing the browser sends
 * except product ids and quantities is believed.
 */
export async function placeOrder(input: PlaceOrderInput, customerId: string | null): Promise<PlaceOrderResult> {
  const email = input.email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Enter a valid email address." };
  if (!input.firstName.trim() || !input.address.trim() || !input.city.trim() || !input.country.trim()) {
    return { ok: false, message: "Please fill in your shipping address." };
  }
  if (input.items.length === 0 || input.items.length > 50) return { ok: false, message: "Your bag is empty." };

  const database = db();
  const products = await database.products.list();

  const lines: OrderItem[] = [];
  const stockChanges = new Map<string, Map<string, number>>(); // productId -> variantId -> qty

  for (const line of input.items) {
    const qty = Math.floor(Number(line.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) return { ok: false, message: "Invalid quantity." };
    const product = products.find((p) => p.id === line.productId && p.status === "active");
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) return { ok: false, message: "An item in your bag is no longer available." };
    const already = stockChanges.get(product.id)?.get(variant.id) ?? 0;
    if (variant.inventory < already + qty) {
      return { ok: false, message: `Only ${variant.inventory} of “${product.title}” left in stock.` };
    }
    if (!stockChanges.has(product.id)) stockChanges.set(product.id, new Map());
    stockChanges.get(product.id)!.set(variant.id, already + qty);

    lines.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title === "Default" ? "" : variant.title,
      image: product.images[0]?.url ?? "",
      sku: variant.sku,
      quantity: qty,
      price: variant.price,
    });
  }

  const settings = await getStoreSettings();
  const rules = { freeShippingThreshold: settings.freeShippingThreshold, flatShippingRate: settings.flatShippingRate, taxRate: settings.taxRate };

  const rawSubtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const couponCheck = input.couponCode ? await checkCoupon(input.couponCode, rawSubtotal) : null;
  if (couponCheck && !couponCheck.valid) return { ok: false, message: couponCheck.message ?? "That coupon can't be used." };

  const totals = calculateTotals(lines, couponCheck?.coupon ?? null, rules);
  const shippingCost = input.shippingMethod === "express" ? EXPRESS_SHIPPING : totals.shipping;
  const total = Math.round((totals.subtotal - totals.discount + shippingCost + totals.tax) * 100) / 100;

  const shipTo: Address = {
    fullName: `${input.firstName} ${input.lastName}`.trim(),
    phone: input.phone,
    line1: input.address,
    city: input.city,
    country: input.country,
    postalCode: input.postal,
  };

  const existing = await database.orders.list();
  let number = "";
  do number = `TU-${Math.floor(100000 + Math.random() * 900000)}`;
  while (existing.some((o) => o.number === number));

  const now = new Date().toISOString();
  const order: Order = {
    id: `order-${Date.now().toString(36)}`,
    number,
    customerId: customerId ?? "guest",
    customerName: shipTo.fullName,
    email,
    items: lines,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingCost,
    tax: totals.tax,
    total,
    currency: "EGP",
    couponCode: couponCheck?.coupon?.code,
    // No payment gateway is wired up yet, so orders start as pending/unpaid.
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    supplierStatus: "not_sent",
    paymentMethod: PAYMENT_LABEL[input.paymentMethod],
    shippingAddress: shipTo,
    billingAddress: shipTo,
    shippingMethod: input.shippingMethod === "express" ? "Express (1–2 days)" : "Standard (3–7 days)",
    timeline: [{ id: "evt-1", label: "Order placed", description: "Customer completed checkout.", actor: "customer", timestamp: now }],
    createdAt: now,
    updatedAt: now,
  };

  await database.orders.upsert(order);

  // Reserve stock.
  for (const [productId, variants] of stockChanges) {
    const product = products.find((p) => p.id === productId)!;
    const updatedVariants = product.variants.map((v) => ({ ...v, inventory: v.inventory - (variants.get(v.id) ?? 0) }));
    await database.products.upsert({
      ...product,
      variants: updatedVariants,
      totalInventory: updatedVariants.reduce((s, v) => s + v.inventory, 0),
      updatedAt: now,
    });
  }

  if (couponCheck?.coupon) {
    const coupon = await findCoupon(couponCheck.coupon.code);
    if (coupon) await database.coupons.upsert({ ...coupon, usedCount: coupon.usedCount + 1 });
  }

  return { ok: true, order };
}
