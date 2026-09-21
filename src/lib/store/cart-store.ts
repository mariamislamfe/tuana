"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CouponDef } from "@/lib/services/pricing";

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  variantTitle: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  quantity: number;
  maxQuantity: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  coupon: CouponDef | null;
  open: () => void;
  close: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  setCoupon: (coupon: CouponDef | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (line, quantity = 1) => {
        const existing = get().items.find((i) => i.variantId === line.variantId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantId === line.variantId
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxQuantity) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, { ...line, quantity: Math.min(quantity, line.maxQuantity) }], isOpen: true });
        }
      },
      removeItem: (variantId) => set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      updateQuantity: (variantId, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
    }),
    { name: "tuana-cart" }
  )
);

export function cartSubtotal(items: CartLine[]) {
  return Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
}

export function cartCount(items: CartLine[]) {
  return items.reduce((s, i) => s + i.quantity, 0);
}
