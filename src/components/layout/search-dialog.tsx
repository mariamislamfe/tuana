"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProductSearch } from "@/lib/hooks/use-products";
import { formatCurrency } from "@/lib/utils";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { products: suggestions, loading } = useProductSearch(query);

  function goToSearch() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onOpenChange(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[18%] max-w-xl translate-y-0 p-0" showClose={false}>
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Search className="size-[18px] text-ink-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToSearch()}
            placeholder="Search products..."
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="hidden rounded-xs border border-line px-1.5 py-0.5 text-[10px] text-ink-3 sm:block">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {query.trim() === "" ? (
            <p className="px-5 py-8 text-center text-sm text-ink-3">Start typing to search the catalog.</p>
          ) : loading ? (
            <p className="px-5 py-8 text-center text-sm text-ink-3">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-3">No products found for &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="p-2">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-surface"
                  >
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-xs bg-surface">
                      <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{p.title}</p>
                      <p className="text-[13px] text-ink-3">{formatCurrency(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {query.trim() && (
          <button
            onClick={goToSearch}
            className="flex w-full items-center justify-between border-t border-line px-5 py-3.5 text-sm text-ink-2 transition-colors hover:bg-surface"
          >
            View all results for &ldquo;{query}&rdquo;
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
