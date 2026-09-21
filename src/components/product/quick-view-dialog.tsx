"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./rating-stars";
import { VariantSelector, findVariant } from "./variant-selector";
import { formatCurrency, discountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/lib/store/toast-store";

export function QuickViewDialog({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const addItem = useCartStore((s) => s.addItem);
  const variant = findVariant(product.variants, selected) ?? product.variants[0];
  const discount = discountPercent(product.price, product.compareAtPrice);

  function handleAdd() {
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      variantTitle: variant.title === "Default" ? "" : variant.title,
      image: product.images[0].url,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      sku: variant.sku,
      maxQuantity: variant.inventory,
    });
    toast({ title: "Added to bag", description: product.title, variant: "success" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-square bg-surface sm:aspect-auto">
            <Image src={product.images[0].url} alt={product.title} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col p-6">
            <p className="text-[11px] uppercase tracking-wide text-ink-3">{product.brand}</p>
            <h2 className="mt-1 font-display text-2xl text-ink">{product.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-[13px] text-ink-3">({product.reviewCount} reviews)</span>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="text-xl font-medium text-ink">{formatCurrency(variant?.price ?? product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-sm text-ink-3 line-through">{formatCurrency(product.compareAtPrice)}</span>
                  <span className="text-[13px] font-medium text-accent">Save {discount}%</span>
                </>
              )}
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">{product.shortDescription}</p>

            {product.options.length > 0 && (
              <div className="mt-5">
                <VariantSelector options={product.options} variants={product.variants} selected={selected} onChange={setSelected} />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5">
              <Button size="lg" onClick={handleAdd} disabled={!variant || variant.inventory === 0}>
                {variant && variant.inventory === 0 ? "Out of Stock" : "Add to Bag"}
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
