"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency, discountPercent, cn } from "@/lib/utils";
import { RatingStars } from "./rating-stars";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/lib/store/toast-store";
import { QuickViewDialog } from "./quick-view-dialog";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const hasWish = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const defaultVariant = product.variants[0];
  const singleVariant = product.variants.length === 1;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!singleVariant) {
      setQuickViewOpen(true);
      return;
    }
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      slug: product.slug,
      title: product.title,
      variantTitle: defaultVariant.title === "Default" ? "" : defaultVariant.title,
      image: product.images[0].url,
      price: defaultVariant.price,
      compareAtPrice: defaultVariant.compareAtPrice,
      sku: defaultVariant.sku,
      maxQuantity: defaultVariant.inventory,
    });
    toast({ title: "Added to bag", description: product.title, variant: "success" });
  }

  return (
    <>
      <div className="group relative flex flex-col">
        <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-surface">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />

          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {product.newArrival && <Badge variant="ink">New</Badge>}
            {discount > 0 && <Badge variant="accent">-{discount}%</Badge>}
            {product.totalInventory === 0 && <Badge variant="outline" className="bg-paper-raised">Sold Out</Badge>}
          </div>

          <button
            aria-label={hasWish ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
            }}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper-raised/90 text-ink opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0"
          >
            <Heart className={cn("h-4 w-4", hasWish && "fill-accent text-accent")} strokeWidth={1.6} />
          </button>

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-2.5 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <button
              onClick={quickAdd}
              disabled={product.totalInventory === 0}
              className="flex-1 rounded-xs bg-ink py-2.5 text-[12.5px] font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-2 disabled:opacity-40"
            >
              {product.totalInventory === 0 ? "Sold Out" : singleVariant ? "Quick Add" : "Select Options"}
            </button>
            <button
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xs bg-paper-raised text-ink transition-colors hover:bg-surface"
            >
              <Eye className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </Link>

        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-3">{product.brand}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="mt-0.5 truncate text-[14.5px] text-ink">{product.title}</h3>
          </Link>
          <div className="mt-1 flex items-center gap-1.5">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-[12px] text-ink-3">({product.reviewCount})</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[14.5px] font-medium text-ink">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-[13px] text-ink-3 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>

      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
