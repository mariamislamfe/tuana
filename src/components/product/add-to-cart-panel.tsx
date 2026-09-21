"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Truck, RotateCcw, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency, discountPercent, cn } from "@/lib/utils";
import { RatingStars } from "./rating-stars";
import { VariantSelector, findVariant } from "./variant-selector";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { toast } from "@/lib/store/toast-store";

export function AddToCartPanel({ product, shippingLine, returnsLine }: { product: Product; shippingLine: string; returnsLine: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const hasWish = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const variant = findVariant(product.variants, selected) ?? product.variants[0];
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = !variant || variant.inventory === 0;
  const lowStock = variant && variant.inventory > 0 && variant.inventory <= 5;

  function buildLine() {
    return {
      productId: product.id,
      variantId: variant!.id,
      slug: product.slug,
      title: product.title,
      variantTitle: variant!.title === "Default" ? "" : variant!.title,
      image: product.images[0].url,
      price: variant!.price,
      compareAtPrice: variant!.compareAtPrice,
      sku: variant!.sku,
      maxQuantity: variant!.inventory,
    };
  }

  function handleAdd() {
    if (outOfStock) return;
    addItem(buildLine(), quantity);
    toast({ title: "Added to bag", description: `${product.title}${variant!.title !== "Default" ? ` — ${variant!.title}` : ""}`, variant: "success" });
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(buildLine(), quantity);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col">
      <p className="text-[12px] uppercase tracking-wide text-ink-3">{product.brand}</p>
      <h1 className="mt-1.5 font-display text-[30px] leading-tight text-ink sm:text-[34px]">{product.title}</h1>

      <div className="mt-2.5 flex items-center gap-2">
        <RatingStars rating={product.rating} />
        <a href="#reviews" className="text-[13px] text-ink-3 hover:text-ink hover:underline">
          {product.reviewCount} reviews
        </a>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl font-medium text-ink">{formatCurrency(variant?.price ?? product.price)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-base text-ink-3 line-through">{formatCurrency(product.compareAtPrice)}</span>
            <span className="rounded-xs bg-accent-soft px-2 py-0.5 text-[12.5px] font-medium text-accent-strong">Save {discount}%</span>
          </>
        )}
      </div>

      <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2">{product.shortDescription}</p>

      {product.options.length > 0 && (
        <div className="mt-6">
          <VariantSelector options={product.options} variants={product.variants} selected={selected} onChange={setSelected} />
        </div>
      )}

      {lowStock && <p className="mt-4 text-[13px] font-medium text-warning">Only {variant!.inventory} left in stock</p>}
      {outOfStock && <p className="mt-4 text-[13px] font-medium text-danger">Currently out of stock</p>}

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-line-strong">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-12 w-11 items-center justify-center text-ink-2 hover:text-ink"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm text-ink">{quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(variant?.inventory ?? 1, q + 1))}
            className="flex h-12 w-11 items-center justify-center text-ink-2 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          aria-label={hasWish ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWish(product.id)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-line-strong text-ink transition-colors hover:border-ink"
        >
          <Heart className={cn("h-[18px] w-[18px]", hasWish && "fill-accent text-accent")} strokeWidth={1.6} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={handleAdd} disabled={outOfStock}>
          Add to Bag
        </Button>
        <Button size="lg" variant="outline" className="flex-1" onClick={handleBuyNow} disabled={outOfStock}>
          Buy Now
        </Button>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} />
          <p className="text-[13px] text-ink-2">
            {product.shipping.freeShipping ? "Free shipping. " : ""}
            {shippingLine}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} />
          <p className="text-[13px] text-ink-2">{returnsLine}</p>
        </div>
      </div>

      {product.bullets.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2 border-t border-line pt-6">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={1.8} />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
