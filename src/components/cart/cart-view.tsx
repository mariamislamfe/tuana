"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { calculateTotals, type PricingRules } from "@/lib/services/pricing";
import { validateCouponAction } from "@/lib/services/coupon-actions";
import type { Product } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/lib/store/toast-store";
import { ProductGrid } from "@/components/product/product-grid";

export function CartView({ recommended, rules }: { recommended: Product[]; rules: PricingRules }) {
  const { items, removeItem, updateQuantity, coupon, setCoupon } = useCartStore();
  const mounted = useMounted();
  const [couponInput, setCouponInput] = useState("");

  const totals = calculateTotals(items, coupon, rules);
  const remaining = Math.max(totals.freeShippingThreshold - (totals.subtotal - totals.discount), 0);
  const progress = Math.min(((totals.subtotal - totals.discount) / totals.freeShippingThreshold) * 100, 100);
  const recommendations = recommended.filter((p) => !items.some((i) => i.productId === p.id));

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    const result = await validateCouponAction(couponInput, totals.subtotal);
    if (!result.valid || !result.coupon) {
      toast({ title: "Code not applied", description: result.message, variant: "danger" });
      return;
    }
    setCoupon(result.coupon);
    toast({ title: "Coupon applied", variant: "success" });
    setCouponInput("");
  }

  if (!mounted) return <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet."
          action={
            <Button asChild className="mt-2">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-ink sm:text-[38px]">Your Bag</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {remaining > 0 ? (
            <p className="text-[13px] text-ink-2">
              Add <span className="font-medium text-ink">{formatCurrency(remaining)}</span> more for free shipping
            </p>
          ) : (
            <p className="text-[13px] font-medium text-success">You&apos;ve unlocked free shipping</p>
          )}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <ul className="mt-8 flex flex-col divide-y divide-line">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-6 first:pt-0">
                <Link href={`/product/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-surface">
                  <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-[15px] font-medium text-ink hover:underline">
                        {item.title}
                      </Link>
                      {item.variantTitle && <p className="mt-0.5 text-[13px] text-ink-3">{item.variantTitle}</p>}
                      <p className="mt-0.5 text-[12.5px] text-ink-3">SKU: {item.sku}</p>
                    </div>
                    <button aria-label="Remove item" onClick={() => removeItem(item.variantId)} className="h-fit text-ink-3 hover:text-danger">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-line">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm text-ink">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[15px] font-medium text-ink">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {recommendations.length > 0 && (
            <div className="mt-12 border-t border-line pt-8">
              <h2 className="mb-5 font-display text-xl text-ink">You might also like</h2>
              <ProductGrid products={recommendations} columns={4} />
            </div>
          )}
        </div>

        <div className="h-fit rounded-md border border-line bg-paper-raised p-6">
          <h2 className="text-[15px] font-semibold text-ink">Order Summary</h2>

          <div className="mt-4 flex items-center gap-2">
            <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
            <Button variant="outline" onClick={applyCoupon} className="shrink-0">
              Apply
            </Button>
          </div>
          {coupon && (
            <div className="mt-2.5 flex items-center justify-between rounded-xs bg-accent-soft px-3 py-2 text-[12.5px] text-accent-strong">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> {coupon.code} applied
              </span>
              <button onClick={() => setCoupon(null)} className="hover:underline">
                Remove
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-[13.5px]">
            <div className="flex justify-between text-ink-2">
              <span>Subtotal</span>
              <span className="text-ink">{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-ink-2">
                <span>Discount</span>
                <span className="text-success">-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-2">
              <span>Shipping</span>
              <span className={cn("text-ink", totals.shipping === 0 && "text-success")}>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Estimated tax</span>
              <span className="text-ink">{formatCurrency(totals.tax)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-[15px] font-medium text-ink">Total</span>
            <span className="text-xl font-medium text-ink">{formatCurrency(totals.total)}</span>
          </div>

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
