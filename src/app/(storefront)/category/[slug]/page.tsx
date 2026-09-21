import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts, listCategories, getCategoryBySlug } from "@/lib/services/products-service";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { MobileFilters } from "@/components/shop/mobile-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateStaticParams() {
  return (await listCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategoryBySlug(slug));
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = (await getCategoryBySlug(slug));
  if (!category) notFound();

  const categories = (await listCategories());
  const products = (await listProducts({
    categorySlug: slug,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    inStockOnly: sp.inStock === "1",
    minRating: sp.rating ? Number(sp.rating) : undefined,
    sort: (sp.sort as never) ?? "featured",
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink sm:text-[38px]">{category.name}</h1>
        <p className="mt-1.5 max-w-lg text-sm text-ink-3">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar categories={categories} activeCategory={slug} />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <MobileFilters categories={categories} activeCategory={slug} />
            <p className="hidden text-[13px] text-ink-3 sm:block">{products.length} products</p>
            <div className="ml-auto">
              <SortSelect />
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState title="No products in this category yet" description="Check back soon, or browse the full catalog." />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
