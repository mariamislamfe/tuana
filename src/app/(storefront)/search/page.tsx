import { listProducts } from "@/lib/services/products-service";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const products = query ? (await listProducts({ query })) : [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-3xl text-ink sm:text-[38px]">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
      </h1>
      <p className="mt-1.5 mb-8 text-sm text-ink-3">{products.length} products found</p>

      {products.length === 0 ? (
        <EmptyState title="No results found" description="Try a different search term or browse the full catalog." />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
