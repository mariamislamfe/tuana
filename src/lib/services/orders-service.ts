import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Order, OrderStatus } from "@/lib/types";

const loadOrders = cache(() => db().orders.list());

export interface OrderFilters {
  status?: OrderStatus | "all";
  query?: string;
  from?: Date;
  to?: Date;
}

export async function listOrders(filters: OrderFilters = {}): Promise<Order[]> {
  let list = await loadOrders();
  if (filters.status && filters.status !== "all") list = list.filter((o) => o.status === filters.status);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (o) => o.number.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)
    );
  }
  if (filters.from) list = list.filter((o) => new Date(o.createdAt) >= filters.from!);
  if (filters.to) list = list.filter((o) => new Date(o.createdAt) <= filters.to!);
  return list;
}

export async function getOrder(idOrNumber: string) {
  return db().orders.get(idOrNumber);
}

export async function ordersForEmail(email: string) {
  const wanted = email.toLowerCase();
  return (await loadOrders()).filter((o) => o.email.toLowerCase() === wanted);
}

export async function saveOrder(order: Order) {
  await db().orders.upsert(order);
}

export async function orderStatusCounts() {
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    failed: 0,
  };
  for (const o of await loadOrders()) counts[o.status]++;
  return counts;
}
