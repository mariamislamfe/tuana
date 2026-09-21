"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function CartDrawer({ recommended, freeShippingThreshold }: { recommended: Product[]; freeShippingThreshold: number }) {
  const FREE_SHIPPING_THRESHOLD = freeShippingThreshold;
  const { items, isOpen, close, removeItem, updateQuantity } = useCartStore();
  const mounted = useMounted();

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const recommendations = recommended.filter((p) => !items.some((i) => i.productId === p.id)).slice(0, 3);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="p-0">
        <SheetHeader>
          <SheetTitle>Your Bag {mounted && items.length > 0 ? `(${items.length})` : ""}</SheetTitle>
        </SheetHeader>

        {mounted && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-9 w-9 text-ink-3" strokeWidth={1.3} />
            <div>
              <p className="text-[15px] font-medium text-ink">Your bag is empty</p>
              <p className="mt-1 text-sm text-ink-3">Add something you&apos;ll actually use.</p>
            </div>
            <Button variant="outline" asChild onClick={close}>
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-2">
                  {remaining > 0 ? (
                    <>Add <span className="font-medium text-ink">{formatCurrency(remaining)}</span> more for free shipping</>
                  ) : (
                    <span className="font-medium text-success">You&apos;ve unlocked free shipping</span>
                  )}
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
                <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3.5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface">
                      <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link href={`/product/${item.slug}`} onClick={close} className="text-[13.5px] font-medium text-ink hover:underline">
                            {item.title}
                          </Link>
                          {item.variantTitle && <p className="mt-0.5 text-[12.5px] text-ink-3">{item.variantTitle}</p>}
                        </div>
                        <button aria-label="Remove item" onClick={() => removeItem(item.variantId)} className="h-fit text-ink-3 hover:text-ink">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-sm border border-line">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink-2 hover:text-ink"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-[13px] text-ink">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="flex h-7 w-7 items-center justify-center text-ink-2 hover:text-ink disabled:opacity-30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-[13.5px] font-medium text-ink">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {recommendations.length > 0 && (
                <div className="mt-8 border-t border-line pt-5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-3">You might also like</p>
                  <div className="flex flex-col gap-3">
                    {recommendations.map((p) => (
                      <Link key={p.id} href={`/product/${p.slug}`} onClick={close} className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xs bg-surface">
                          <Image src={p.images[0].url} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] text-ink">{p.title}</p>
                          <p className="text-[12.5px] text-ink-3">{formatCurrency(p.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-line px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-ink-2">Subtotal</span>
                <span className="text-[17px] font-medium text-ink">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mb-4 text-[12.5px] text-ink-3">Shipping and taxes calculated at checkout.</p>
              <Button asChild size="lg" className="w-full" onClick={close}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button variant="ghost" className="mt-2 w-full" onClick={close}>
                Continue shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
