import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "lucide-react";

export function ProductSection({
  eyebrow,
  title,
  products,
  viewAllHref,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <Reveal className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
        </div>
        <Link href={viewAllHref} className="group hidden items-center gap-1.5 text-[13.5px] font-medium text-ink sm:flex">
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <ProductGrid products={products} />

      <Link href={viewAllHref} className="mt-8 flex items-center justify-center gap-1.5 text-[13.5px] font-medium text-ink sm:hidden">
        View all
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
