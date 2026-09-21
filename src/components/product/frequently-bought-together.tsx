"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/lib/store/toast-store";

export function FrequentlyBoughtTogether({ product, related }: { product: Product; related: Product[] }) {
  const bundle = [product, ...related.slice(0, 2)];
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(bundle.map((p) => [p.id, true])));
  const addItem = useCartStore((s) => s.addItem);

  const selected = bundle.filter((p) => checked[p.id]);
  const total = selected.reduce((s, p) => s + p.price, 0);

  function addAll() {
    selected.forEach((p) => {
      const v = p.variants[0];
      addItem({
        productId: p.id,
        variantId: v.id,
        slug: p.slug,
        title: p.title,
        variantTitle: v.title === "Default" ? "" : v.title,
        image: p.images[0].url,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        sku: v.sku,
        maxQuantity: v.inventory,
      });
    });
    toast({ title: "Added to bag", description: `${selected.length} items added`, variant: "success" });
  }

  if (related.length === 0) return null;

  return (
    <section className="border-t border-line py-14">
      <h2 className="mb-6 font-display text-2xl text-ink">Frequently Bought Together</h2>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {bundle.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <label className="flex items-center gap-2.5">
                <Checkbox checked={checked[p.id]} onCheckedChange={(v) => setChecked((c) => ({ ...c, [p.id]: Boolean(v) }))} />
                <Link href={`/product/${p.slug}`} className="flex items-center gap-2.5">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xs bg-surface">
                    <Image src={p.images[0].url} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <p className="max-w-32 truncate text-[13px] text-ink">{p.title}</p>
                    <p className="text-[12.5px] text-ink-3">{formatCurrency(p.price)}</p>
                  </div>
                </Link>
              </label>
              {i < bundle.length - 1 && <Plus className="h-4 w-4 text-ink-3" />}
            </div>
          ))}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2.5 rounded-md border border-line bg-paper-raised px-5 py-4">
          <p className="text-[13px] text-ink-2">
            Total for {selected.length} item{selected.length === 1 ? "" : "s"}: <span className="font-medium text-ink">{formatCurrency(total)}</span>
          </p>
          <Button onClick={addAll} disabled={selected.length === 0}>
            Add Selected to Bag
          </Button>
        </div>
      </div>
    </section>
  );
}
