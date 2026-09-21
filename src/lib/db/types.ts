import type { Product, Category, Coupon, Order } from "@/lib/types";
import type { StoreSettings } from "@/lib/data/store-settings";
import type { SiteContent } from "@/lib/content/types";

/**
 * The only thing the rest of the app knows about storage. Two
 * implementations exist: `supabase-backend` (production) and `file-backend`
 * (local demo mode when Supabase env vars are not set).
 */
export interface Db {
  readonly kind: "supabase" | "file";
  products: {
    list(): Promise<Product[]>;
    upsert(product: Product): Promise<void>;
    remove(id: string): Promise<void>;
  };
  categories: {
    list(): Promise<Category[]>;
    /** `sort` only matters when creating; omit it on updates to keep the current position. */
    upsert(category: Category, opts?: { sort?: number }): Promise<void>;
    remove(id: string): Promise<void>;
  };
  coupons: {
    list(): Promise<Coupon[]>;
    upsert(coupon: Coupon): Promise<void>;
    remove(id: string): Promise<void>;
  };
  settings: {
    get(): Promise<StoreSettings>;
    save(settings: StoreSettings): Promise<void>;
  };
  content: {
    get(): Promise<Partial<SiteContent>>;
    save(content: Partial<SiteContent>): Promise<void>;
  };
  orders: {
    list(): Promise<Order[]>;
    get(idOrNumber: string): Promise<Order | null>;
    upsert(order: Order): Promise<void>;
  };
}
