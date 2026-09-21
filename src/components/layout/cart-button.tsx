"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const mounted = useMounted();
  const count = mounted ? cartCount(items) : 0;

  return (
    <button
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      onClick={open}
      className={cn("relative flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface", className)}
    >
      <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
      {count > 0 && (
        <span key={count} className="anim-bump absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
