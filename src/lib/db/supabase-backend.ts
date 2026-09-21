import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Product, Category, Coupon, Order } from "@/lib/types";
import type { SiteContent } from "@/lib/content/types";
import { defaultSettings, type StoreSettings } from "@/lib/data/store-settings";
import { supabaseEnv } from "./env";
import type { Db } from "./types";

/**
 * Service-role client: server-only, bypasses RLS. Every caller (server
 * actions / route handlers) must have already checked who the user is.
 */
const g = globalThis as unknown as { __tuanaSupabase?: SupabaseClient };
export function serviceClient(): SupabaseClient {
  return (g.__tuanaSupabase ??= createClient(supabaseEnv.url(), supabaseEnv.serviceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  }));
}

function fail(action: string, error: { message: string } | null) {
  if (error) throw new Error(`Supabase ${action} failed: ${error.message}`);
}

async function docs<T>(table: string, order: { column: string; ascending?: boolean }[]): Promise<T[]> {
  let q = serviceClient().from(table).select("data");
  for (const o of order) q = q.order(o.column, { ascending: o.ascending ?? true });
  const { data, error } = await q;
  fail(`select ${table}`, error);
  return (data ?? []).map((r) => r.data as T);
}

async function removeRow(table: string, id: string) {
  const { error } = await serviceClient().from(table).delete().eq("id", id);
  fail(`delete ${table}`, error);
}

async function getDoc<T>(key: string): Promise<T | null> {
  const { data, error } = await serviceClient().from("site_settings").select("data").eq("key", key).maybeSingle();
  fail(`select settings ${key}`, error);
  return (data?.data as T) ?? null;
}

async function saveDoc(key: string, value: unknown) {
  const { error } = await serviceClient()
    .from("site_settings")
    .upsert({ key, data: value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  fail(`save settings ${key}`, error);
}

const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const supabaseDb: Db = {
  kind: "supabase",
  products: {
    list: () => docs<Product>("products", [{ column: "created_at", ascending: false }]),
    upsert: async (p) => {
      const { error } = await serviceClient()
        .from("products")
        .upsert({ id: p.id, slug: p.slug, status: p.status, data: p, created_at: p.createdAt, updated_at: new Date().toISOString() }, { onConflict: "id" });
      fail("upsert products", error);
    },
    remove: (id) => removeRow("products", id),
  },
  categories: {
    list: () => docs<Category>("categories", [{ column: "sort" }, { column: "created_at" }]),
    upsert: async (c, opts) => {
      const row: Record<string, unknown> = { id: c.id, slug: c.slug, data: c };
      if (opts?.sort !== undefined) row.sort = opts.sort;
      const { error } = await serviceClient().from("categories").upsert(row, { onConflict: "id" });
      fail("upsert categories", error);
    },
    remove: (id) => removeRow("categories", id),
  },
  coupons: {
    list: () => docs<Coupon>("coupons", [{ column: "code" }]),
    upsert: async (c) => {
      const { error } = await serviceClient().from("coupons").upsert({ id: c.id, code: c.code, data: c }, { onConflict: "id" });
      fail("upsert coupons", error);
    },
    remove: (id) => removeRow("coupons", id),
  },
  settings: {
    get: async () => ({ ...defaultSettings(), ...((await getDoc<StoreSettings>("store")) ?? {}) }),
    save: (s) => saveDoc("store", s),
  },
  content: {
    get: async () => (await getDoc<Partial<SiteContent>>("content")) ?? {},
    save: async (patch) => saveDoc("content", { ...((await getDoc<Partial<SiteContent>>("content")) ?? {}), ...patch }),
  },
  orders: {
    list: () => docs<Order>("orders", [{ column: "created_at", ascending: false }]),
    get: async (key) => {
      const col = key.toUpperCase().startsWith("TU-") ? "number" : "id";
      const { data, error } = await serviceClient().from("orders").select("data").eq(col, key).maybeSingle();
      fail("select order", error);
      return (data?.data as Order) ?? null;
    },
    upsert: async (o) => {
      const { error } = await serviceClient()
        .from("orders")
        .upsert(
          { id: o.id, number: o.number, customer_id: isUuid(o.customerId) ? o.customerId : null, email: o.email.toLowerCase(), status: o.status, total: o.total, data: o, created_at: o.createdAt },
          { onConflict: "id" }
        );
      fail("upsert orders", error);
    },
  },
};
