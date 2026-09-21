import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Order } from "@/lib/types";

export type DateRangeKey = "today" | "7d" | "30d" | "90d" | "all";

const REVENUE_COUNTED_STATUSES: Order["status"][] = ["confirmed", "processing", "shipped", "delivered"];

const load = cache(async () => {
  const [orders, products, categories] = await Promise.all([db().orders.list(), db().products.list(), db().categories.list()]);
  return { orders, products, categories };
});

export function rangeToDates(range: DateRangeKey): { from: Date; to: Date } {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);
  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "90d":
      from.setDate(from.getDate() - 90);
      break;
    case "all":
      from.setFullYear(from.getFullYear() - 5);
      break;
  }
  return { from, to };
}

function inRange(order: Order, from: Date, to: Date) {
  const t = new Date(order.createdAt).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** First order date per customer email — customers are derived from orders. */
function firstOrderByEmail(orders: Order[]) {
  const first = new Map<string, Order>();
  for (const o of [...orders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const key = o.email.toLowerCase();
    if (!first.has(key)) first.set(key, o);
  }
  return first;
}

export async function dashboardSummary(range: DateRangeKey) {
  const { orders, products } = await load();
  const { from, to } = rangeToDates(range);
  const inWindow = orders.filter((o) => inRange(o, from, to));
  const revenueOrders = inWindow.filter((o) => REVENUE_COUNTED_STATUSES.includes(o.status));

  const totalRevenue = round2(revenueOrders.reduce((s, o) => s + o.total, 0));
  const ordersCount = inWindow.length;
  const aov = revenueOrders.length ? round2(totalRevenue / revenueOrders.length) : 0;

  const estimatedCost = revenueOrders.reduce(
    (s, o) => s + o.items.reduce((is, it) => is + (it.supplierCost ?? it.price * 0.45) * it.quantity, 0),
    0
  );
  const estimatedProfit = round2(totalRevenue - estimatedCost - revenueOrders.reduce((s, o) => s + o.shippingCost, 0) * 0.4);

  const first = firstOrderByEmail(orders);
  const newCustomers = [...first.values()].filter((o) => inRange(o, from, to)).length;

  // No traffic pipeline yet — conversion is modeled from order volume until analytics are connected.
  const estimatedSessions = Math.max(ordersCount * 34, 120);
  const conversionRate = ordersCount ? round2((ordersCount / estimatedSessions) * 100) : 0;

  return {
    totalRevenue,
    ordersCount,
    aov,
    estimatedProfit,
    pendingOrders: inWindow.filter((o) => o.status === "pending" || o.status === "confirmed").length,
    failedOrders: inWindow.filter((o) => o.status === "failed").length,
    returnedOrders: inWindow.filter((o) => o.status === "returned").length,
    newCustomers,
    totalCustomers: first.size,
    conversionRate,
    productsCount: products.filter((p) => p.status === "active").length,
  };
}

export function percentDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function dashboardDeltas(range: DateRangeKey) {
  if (range === "all") return { revenue: undefined, orders: undefined };
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const span = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - span);
  const prev = orders.filter((o) => inRange(o, prevFrom, prevTo));
  const prevRevenue = round2(prev.filter((o) => REVENUE_COUNTED_STATUSES.includes(o.status)).reduce((s, o) => s + o.total, 0));
  const current = await dashboardSummary(range);
  return {
    revenue: percentDelta(current.totalRevenue, prevRevenue),
    orders: percentDelta(current.ordersCount, prev.length),
  };
}

export async function revenueOverTime(range: DateRangeKey) {
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
  const buckets = new Map<string, { revenue: number; orders: number }>();

  const cursor = new Date(from);
  for (let i = 0; i <= days; i++) {
    buckets.set(cursor.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const o of orders) {
    if (!inRange(o, from, to)) continue;
    const bucket = buckets.get(o.createdAt.slice(0, 10));
    if (!bucket) continue;
    bucket.orders += 1;
    if (REVENUE_COUNTED_STATUSES.includes(o.status)) bucket.revenue += o.total;
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({ date, revenue: round2(v.revenue), orders: v.orders }));
}

export async function topProducts(range: DateRangeKey, limit = 5) {
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const byProduct = new Map<string, { title: string; revenue: number; units: number; image: string }>();

  for (const o of orders) {
    if (!inRange(o, from, to) || !REVENUE_COUNTED_STATUSES.includes(o.status)) continue;
    for (const item of o.items) {
      const entry = byProduct.get(item.productId) ?? { title: item.title, revenue: 0, units: 0, image: item.image };
      entry.revenue += item.price * item.quantity;
      entry.units += item.quantity;
      byProduct.set(item.productId, entry);
    }
  }

  return Array.from(byProduct.entries())
    .map(([productId, v]) => ({ productId, ...v, revenue: round2(v.revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function salesByCategory(range: DateRangeKey) {
  const { orders, products, categories } = await load();
  const { from, to } = rangeToDates(range);
  const byCategory = new Map<string, number>();
  categories.forEach((c) => byCategory.set(c.id, 0));

  for (const o of orders) {
    if (!inRange(o, from, to) || !REVENUE_COUNTED_STATUSES.includes(o.status)) continue;
    for (const item of o.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      for (const catId of product.categoryIds) {
        byCategory.set(catId, (byCategory.get(catId) ?? 0) + item.price * item.quantity);
      }
    }
  }

  return categories
    .map((c) => ({ category: c.name, revenue: round2(byCategory.get(c.id) ?? 0) }))
    .filter((c) => c.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);
}

export async function orderStatusDistribution(range: DateRangeKey) {
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const counts = new Map<string, number>();
  for (const o of orders) {
    if (!inRange(o, from, to)) continue;
    counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
}

export async function recentOrders(limit = 8) {
  const { orders } = await load();
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function refundsSummary(range: DateRangeKey) {
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const refunded = orders.filter((o) => inRange(o, from, to) && o.paymentStatus === "refunded");
  return { count: refunded.length, total: round2(refunded.reduce((s, o) => s + o.total, 0)) };
}

export async function customerAcquisition(range: DateRangeKey) {
  const { orders } = await load();
  const { from, to } = rangeToDates(range);
  const inWindow = orders.filter((o) => inRange(o, from, to) && REVENUE_COUNTED_STATUSES.includes(o.status));
  const first = firstOrderByEmail(orders);

  let newCustomerOrders = 0;
  let returningCustomerOrders = 0;
  for (const o of inWindow) {
    if (first.get(o.email.toLowerCase())?.id === o.id) newCustomerOrders++;
    else returningCustomerOrders++;
  }

  const total = newCustomerOrders + returningCustomerOrders;
  return {
    newCustomerOrders,
    returningCustomerOrders,
    returningRate: total ? round2((returningCustomerOrders / total) * 100) : 0,
  };
}
