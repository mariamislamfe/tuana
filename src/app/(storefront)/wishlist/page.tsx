"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useProductsByIds } from "@/lib/hooks/use-products";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.productIds);
  const mounted = useMounted();
  const products = useProductsByIds(mounted ? ids : []);
  const loading = mounted && ids.length > 0 && products === null;
  const list = products ?? [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="mb-1 font-display text-3xl text-ink sm:text-[38px]">Wishlist</h1>
      <p className="mb-8 text-sm text-ink-3">{mounted ? ids.length : 0} saved items</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: Math.min(ids.length, 4) }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full" />
          ))}
        </div>
      ) : mounted && list.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          action={
            <Button asChild className="mt-2">
              <Link href="/shop">Browse Products</Link>
            </Button>
          }
        />
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
