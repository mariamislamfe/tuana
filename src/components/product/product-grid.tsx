import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function ProductGrid({ products, className, columns = 4 }: { products: Product[]; className?: string; columns?: 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-5",
        columns === 4 ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-3",
        className
      )}
    >
      {products.map((p, i) => (
        <Reveal key={p.id} delay={(i % 4) * 90} scale>
          <ProductCard product={p} priority={i < 4} />
        </Reveal>
      ))}
    </div>
  );
}
