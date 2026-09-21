"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

async function fetchProducts(query: string, signal?: AbortSignal): Promise<Product[]> {
  const res = await fetch(`/api/products?${query}`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { products: Product[] };
  return data.products;
}

/** Products for a list of ids (wishlist, recently viewed). Returns null while loading. */
export function useProductsByIds(ids: string[]) {
  const key = ids.join(",");
  const [state, setState] = useState<{ key: string; products: Product[] } | null>(null);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetchProducts(`ids=${encodeURIComponent(key)}`, controller.signal)
      .then((products) => setState({ key, products }))
      .catch(() => {});
    return () => controller.abort();
  }, [key]);

  if (!key) return [];
  if (!state || state.key !== key) return null;
  // keep the caller's order (most recent first, etc.)
  return ids.map((id) => state.products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

/** Debounced product search for the search dialog. */
export function useProductSearch(query: string) {
  const trimmed = query.trim();
  const [state, setState] = useState<{ query: string; products: Product[] } | null>(null);

  useEffect(() => {
    if (!trimmed) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchProducts(`q=${encodeURIComponent(trimmed)}`, controller.signal)
        .then((products) => setState({ query: trimmed, products }))
        .catch(() => {});
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  if (!trimmed) return { products: [] as Product[], loading: false };
  if (!state || state.query !== trimmed) return { products: [] as Product[], loading: true };
  return { products: state.products, loading: false };
}
