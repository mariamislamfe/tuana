"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RatingStars } from "@/components/product/rating-stars";
import { cn } from "@/lib/utils";
import { groupCategories } from "@/components/layout/nav-utils";

export function FilterSidebar({ categories, activeCategory }: { categories: Category[]; activeCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");

  const inStock = searchParams.get("inStock") === "1";
  const minRating = searchParams.get("rating");

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("min", minPrice);
    else params.delete("min");
    if (maxPrice) params.set("max", maxPrice);
    else params.delete("max");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const hasActiveFilters = Boolean(searchParams.get("category") || searchParams.get("min") || searchParams.get("max") || inStock || minRating);

  return (
    <div className="flex flex-col gap-8">
      {hasActiveFilters && (
        <button onClick={() => { setMinPrice(""); setMaxPrice(""); router.push(pathname); }} className="text-left text-[13px] font-medium text-accent hover:underline">
          Clear all filters
        </button>
      )}

      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Category</p>
        <div className="flex flex-col gap-2.5">
          <Link
            href={pathname === "/shop" ? "/shop" : "/shop"}
            className={cn("text-[13.5px]", !activeCategory ? "font-medium text-ink" : "text-ink-2 hover:text-ink")}
          >
            All Products
          </Link>
          {groupCategories(categories).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-2.5">
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{group}</p>
              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className={cn("text-[13.5px]", activeCategory === c.slug ? "font-medium text-ink" : "text-ink-2 hover:text-ink")}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPrice}
            className="h-9 w-full rounded-sm border border-line-strong bg-paper-raised px-2.5 text-[13px] outline-none focus:border-ink"
          />
          <span className="text-ink-3">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPrice}
            className="h-9 w-full rounded-sm border border-line-strong bg-paper-raised px-2.5 text-[13px] outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Availability</p>
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox checked={inStock} onCheckedChange={(v) => setParam("inStock", v ? "1" : null)} />
          <span className="text-[13.5px] text-ink-2">In stock only</span>
        </label>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Rating</p>
        <div className="flex flex-col gap-2">
          {[4, 3].map((r) => (
            <button
              key={r}
              onClick={() => setParam("rating", minRating === String(r) ? null : String(r))}
              className={cn(
                "flex w-fit items-center gap-2 rounded-xs px-1 py-0.5 text-[13px]",
                minRating === String(r) ? "text-ink" : "text-ink-3 hover:text-ink"
              )}
            >
              <RatingStars rating={r} size={13} />
              & up
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
