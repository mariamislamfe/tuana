import "server-only";
import type { Product, Category, Coupon, Order } from "@/lib/types";
import type { SiteContent } from "@/lib/content/types";
import { persistedStore } from "@/lib/server/persist";
import { seedProducts } from "@/lib/data/products";
import { seedCategories } from "@/lib/data/categories";
import { seedCoupons } from "@/lib/data/coupons";
import { defaultSettings, type StoreSettings } from "@/lib/data/store-settings";
import { generateMockOrders } from "@/lib/data/orders";
import type { Db } from "./types";

/** Local demo storage: JSON files in `data/`, seeded from `lib/data/*`. */
const products = persistedStore<Product[]>("products", 1, seedProducts);
const categories = persistedStore<Category[]>("categories", 1, seedCategories);
const coupons = persistedStore<Coupon[]>("coupons", 1, seedCoupons);
const settings = persistedStore<StoreSettings>("store-settings", 1, defaultSettings);
const content = persistedStore<Partial<SiteContent>>("site-content", 1, () => ({}));
const orders = persistedStore<Order[]>("orders", 1, () => generateMockOrders(seedProducts()));

type Store<T> = { get(): T[]; save(): void };

function upsertById<T extends { id: string }>(store: Store<T>, item: T) {
  const list = store.get();
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) list.unshift(item);
  else list[i] = item;
  store.save();
}

function removeById<T extends { id: string }>(store: Store<T>, id: string) {
  const list = store.get();
  const i = list.findIndex((x) => x.id === id);
  if (i !== -1) list.splice(i, 1);
  store.save();
}

export const fileDb: Db = {
  kind: "file",
  products: {
    list: async () => [...products.get()],
    upsert: async (p) => upsertById(products, p),
    remove: async (id) => removeById(products, id),
  },
  categories: {
    list: async () => [...categories.get()],
    upsert: async (c) => {
      const list = categories.get();
      const i = list.findIndex((x) => x.id === c.id);
      if (i === -1) list.push(c);
      else list[i] = c;
      categories.save();
    },
    remove: async (id) => removeById(categories, id),
  },
  coupons: {
    list: async () => [...coupons.get()],
    upsert: async (c) => upsertById(coupons, c),
    remove: async (id) => removeById(coupons, id),
  },
  settings: {
    get: async () => ({ ...settings.get() }),
    save: async (s) => {
      Object.assign(settings.get(), s);
      settings.save();
    },
  },
  content: {
    get: async () => ({ ...content.get() }),
    save: async (patch) => {
      Object.assign(content.get(), patch);
      content.save();
    },
  },
  orders: {
    list: async () => [...orders.get()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    get: async (key) => orders.get().find((o) => o.id === key || o.number === key) ?? null,
    upsert: async (o) => upsertById(orders, o),
  },
};
