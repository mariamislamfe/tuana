"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function WishlistButton({ className }: { className?: string }) {
  const ids = useWishlistStore((s) => s.productIds);
  const mounted = useMounted();
  const count = mounted ? ids.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} item${count === 1 ? "" : "s"}`}
      className={cn("relative flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface", className)}
    >
      <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-paper">
          {count}
        </span>
      )}
    </Link>
  );
}
