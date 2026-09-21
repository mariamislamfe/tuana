"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  productIds: string[];
  add: (productId: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      add: (productId) => {
        const withoutCurrent = get().productIds.filter((id) => id !== productId);
        set({ productIds: [productId, ...withoutCurrent].slice(0, 8) });
      },
    }),
    { name: "tuana-recently-viewed" }
  )
);
