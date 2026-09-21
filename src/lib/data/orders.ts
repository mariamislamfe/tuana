import type { Product, Order, OrderEvent, OrderItem, OrderStatus, PaymentStatus, FulfillmentStatus, SupplierOrderStatus } from "@/lib/types";
import { customerSeeds, daysAgo } from "./customer-seeds";
let products: Product[] = [];

// Deterministic PRNG so server-render and client-hydration produce identical mock data.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let rng = mulberry32(20260828);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const int = (min: number, max: number) => Math.floor(min + rng() * (max - min + 1));

const STATUS_WEIGHTS: { status: OrderStatus; weight: number }[] = [
  { status: "delivered", weight: 38 },
  { status: "shipped", weight: 14 },
  { status: "processing", weight: 10 },
  { status: "confirmed", weight: 8 },
  { status: "pending", weight: 8 },
  { status: "cancelled", weight: 6 },
  { status: "returned", weight: 5 },
  { status: "failed", weight: 4 },
];

function weightedStatus(): OrderStatus {
  const total = STATUS_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = rng() * total;
  for (const w of STATUS_WEIGHTS) {
    if (r < w.weight) return w.status;
    r -= w.weight;
  }
  return "delivered";
}

function derive(status: OrderStatus): { payment: PaymentStatus; fulfillment: FulfillmentStatus; supplier: SupplierOrderStatus } {
  switch (status) {
    case "pending":
      return { payment: "pending", fulfillment: "unfulfilled", supplier: "not_sent" };
    case "confirmed":
      return { payment: "paid", fulfillment: "unfulfilled", supplier: "sent" };
    case "processing":
      return { payment: "paid", fulfillment: "processing", supplier: "acknowledged" };
    case "shipped":
      return { payment: "paid", fulfillment: "shipped", supplier: "shipped" };
    case "delivered":
      return { payment: "paid", fulfillment: "delivered", supplier: "shipped" };
    case "cancelled":
      return { payment: "refunded", fulfillment: "cancelled", supplier: "not_sent" };
    case "returned":
      return { payment: "refunded", fulfillment: "returned", supplier: "shipped" };
    case "failed":
      return { payment: "failed", fulfillment: "unfulfilled", supplier: "error" };
  }
}

function buildTimeline(status: OrderStatus, createdAtDaysAgo: number): OrderEvent[] {
  const steps: { label: string; description?: string; actor: OrderEvent["actor"] }[] = [
    { label: "Order placed", description: "Customer completed checkout.", actor: "customer" },
  ];
  const { payment } = derive(status);
  if (payment === "failed") {
    steps.push({ label: "Payment failed", description: "Card was declined by the issuing bank.", actor: "system" });
  } else {
    steps.push({ label: "Payment confirmed", actor: "system" });
  }
  if (status === "cancelled") {
    steps.push({ label: "Order cancelled", description: "Cancelled by admin at customer's request.", actor: "admin" });
  } else if (status === "failed") {
    // no further steps
  } else {
    steps.push({ label: "Sent to supplier", description: "Forwarded to Tager for fulfillment.", actor: "system" });
    if (["processing", "shipped", "delivered", "returned"].includes(status)) {
      steps.push({ label: "Supplier acknowledged", description: "Supplier confirmed stock and began processing.", actor: "supplier" });
    }
    if (["shipped", "delivered", "returned"].includes(status)) {
      steps.push({ label: "Shipped", description: "Tracking number issued to customer.", actor: "supplier" });
    }
    if (["delivered", "returned"].includes(status)) {
      steps.push({ label: "Delivered", actor: "system" });
    }
    if (status === "returned") {
      steps.push({ label: "Return initiated", description: "Customer requested a return.", actor: "customer" });
      steps.push({ label: "Refund issued", actor: "admin" });
    }
  }

  const span = Math.max(createdAtDaysAgo, steps.length);
  return steps.map((s, i) => ({
    id: `evt-${i + 1}`,
    label: s.label,
    description: s.description,
    actor: s.actor,
    timestamp: daysAgo(createdAtDaysAgo - (i * span) / Math.max(steps.length - 1, 1)),
  }));
}

const SHIPPING_METHODS = ["Standard (5-7 days)", "Express (2-3 days)", "Free Standard Shipping"];
const PAYMENT_METHODS = ["Visa •••• 4242", "Mastercard •••• 8831", "PayPal", "Apple Pay", "Amex •••• 1005"];

let orderCounter = 10214;

function buildOrder(customerIndex: number, daysAgoCreated: number): Order {
  const seed = customerSeeds[customerIndex];
  const itemCount = int(1, 3);
  const items: OrderItem[] = [];
  const usedProducts = new Set<number>();
  for (let i = 0; i < itemCount; i++) {
    let pIndex = int(0, products.length - 1);
    let guard = 0;
    while (usedProducts.has(pIndex) && guard < 5) {
      pIndex = int(0, products.length - 1);
      guard++;
    }
    usedProducts.add(pIndex);
    const product = products[pIndex];
    const variant = pick(product.variants);
    items.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title === "Default" ? "" : variant.title,
      image: product.images[0].url,
      sku: variant.sku,
      quantity: int(1, 2),
      price: variant.price,
      supplierCost: Math.round(variant.price * 0.45 * 100) / 100,
    });
  }

  const subtotal = Math.round(items.reduce((s, it) => s + it.price * it.quantity, 0) * 100) / 100;
  const status = weightedStatus();
  const hasCoupon = rng() < 0.28;
  const discount = hasCoupon ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const shippingCost = subtotal >= 3000 ? 0 : 60;
  const tax = Math.round((subtotal - discount) * 0.14 * 100) / 100;
  const total = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;
  const { payment, fulfillment, supplier } = derive(status);

  orderCounter += int(1, 4);

  return {
    id: `order-${orderCounter}`,
    number: `TU-${orderCounter}`,
    customerId: seed.id,
    customerName: seed.name,
    email: seed.email,
    items,
    subtotal,
    discount,
    shippingCost,
    tax,
    total,
    currency: "EGP",
    couponCode: hasCoupon ? pick(["WELCOME10", "TUANA10", "FIRSTORDER"]) : undefined,
    status,
    paymentStatus: payment,
    fulfillmentStatus: fulfillment,
    supplierStatus: supplier,
    paymentMethod: pick(PAYMENT_METHODS),
    shippingAddress: seed.address,
    billingAddress: seed.address,
    shippingMethod: pick(SHIPPING_METHODS),
    timeline: buildTimeline(status, daysAgoCreated),
    createdAt: daysAgo(daysAgoCreated),
    updatedAt: daysAgo(Math.max(daysAgoCreated - int(0, 2), 0)),
  };
}

/** Deterministic demo orders — used only when no database is connected. */
export function generateMockOrders(catalog: Product[]): Order[] {
  products = catalog;
  rng = mulberry32(20260828);
  orderCounter = 10214;
  const list: Order[] = [];
  customerSeeds.forEach((seed, idx) => {
    const orderCount = [3, 1, 5, 2, 0, 2, 4, 1, 2, 6, 1, 0, 3, 2, 1, 4, 2, 1, 0, 3, 2, 1][idx] ?? 2;
    for (let i = 0; i < orderCount; i++) {
      const maxAge = Math.max(seed.createdDaysAgo - 2, 3);
      const age = int(1, maxAge);
      list.push(buildOrder(idx, age));
    }
  });
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
