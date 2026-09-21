import type { Metadata } from "next";
import { listProducts, listCategories } from "@/lib/services/products-service";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { MobileFilters } from "@/components/shop/mobile-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Shop All" };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const categories = (await listCategories());

  const products = (await listProducts({
    query: typeof sp.q === "string" ? sp.q : undefined,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    inStockOnly: sp.inStock === "1",
    minRating: sp.rating ? Number(sp.rating) : undefined,
    tag: sp.tag === "new" || sp.tag === "bestseller" ? sp.tag : undefined,
    sort: (sp.sort as never) ?? "featured",
  }));

  const title = sp.tag === "new" ? "New Arrivals" : sp.tag === "bestseller" ? "Best Sellers" : "Shop All";

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink sm:text-[38px]">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-3">{products.length} products</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar categories={categories} />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <MobileFilters categories={categories} />
            <div className="ml-auto">
              <SortSelect />
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState title="No products match those filters" description="Try adjusting or clearing your filters." />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
