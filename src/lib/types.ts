/**
 * Canonical internal domain models.
 *
 * Nothing outside `lib/services/supplier` is allowed to know about a
 * specific supplier's API shape (Tager or otherwise). Every product that
 * reaches the storefront/admin is a `Product` as defined here — see
 * `lib/services/supplier/types.ts` for the normalization boundary.
 */

export type Money = number; // decimal amount in store currency (e.g. 129.00)

export type ProductStatus = "active" | "draft" | "archived";

export type SupplierId = "internal" | "tager";

export interface ProductSource {
  supplier: SupplierId;
  supplierProductId?: string;
  supplierSku?: string;
  lastSyncedAt?: string; // ISO date
  syncStatus?: "synced" | "pending" | "error" | "not_synced";
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductOption {
  name: string; // e.g. "Color"
  values: string[]; // e.g. ["Black", "Sand"]
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // e.g. "Black / M"
  optionValues: Record<string, string>; // { Color: "Black", Size: "M" }
  price: Money;
  compareAtPrice?: Money;
  inventory: number;
  imageId?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  categoryIds: string[];
  shortDescription: string;
  description: string;
  bullets: string[];
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  price: Money;
  compareAtPrice?: Money;
  currency: "EGP";
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  tags: string[];
  status: ProductStatus;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  totalInventory: number;
  source: ProductSource;
  shipping: {
    freeShipping: boolean;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Top-level family used to group categories in menus and filters (e.g. "Skincare"). */
  group: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postalCode?: string;
}

export type CustomerStatus = "active" | "vip" | "at_risk" | "new";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  ordersCount: number;
  totalSpent: Money;
  averageOrderValue: Money;
  lastOrderAt?: string;
  createdAt: string;
  addresses: Address[];
  notes: string[];
  tags: string[];
}

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "failed";
export type SupplierOrderStatus =
  | "not_sent"
  | "sent"
  | "acknowledged"
  | "shipped"
  | "error";

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  image: string;
  sku: string;
  quantity: number;
  price: Money;
  supplierCost?: Money;
}

export interface OrderEvent {
  id: string;
  label: string;
  description?: string;
  timestamp: string;
  actor: "system" | "admin" | "customer" | "supplier";
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  subtotal: Money;
  discount: Money;
  shippingCost: Money;
  tax: Money;
  total: Money;
  currency: "EGP";
  couponCode?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  supplierStatus: SupplierOrderStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  timeline: OrderEvent[];
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number; // percentage points or fixed amount
  minOrderValue?: Money;
  appliesTo: "all" | "category" | "product";
  appliesToIds?: string[];
  startsAt: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
  status: "active" | "scheduled" | "expired" | "disabled";
}

export interface InventoryRecord {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  image: string;
  localStock: number;
  supplierStock: number;
  lowStockThreshold: number;
  source: SupplierId;
}
