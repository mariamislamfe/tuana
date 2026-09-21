"use client";

import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useProductsByIds } from "@/lib/hooks/use-products";
import { ProductGrid } from "./product-grid";

export function RecentlyViewed({ excludeProductId }: { excludeProductId?: string }) {
  const ids = useRecentlyViewedStore((s) => s.productIds);
  const mounted = useMounted();
  const wanted = mounted ? ids.filter((id) => id !== excludeProductId).slice(0, 4) : [];
  const products = useProductsByIds(wanted);

  if (!mounted || !products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
      <h2 className="mb-6 font-display text-2xl text-ink">Recently Viewed</h2>
      <ProductGrid products={products} />
    </section>
  );
}
