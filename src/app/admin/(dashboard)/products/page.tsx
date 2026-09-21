import type { Metadata } from "next";
import { allProductsAdmin } from "@/lib/services/products-service";
import { listCategories, getCategoryBySlug } from "@/lib/services/products-service";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductsFilterBar } from "@/components/admin/products-filter-bar";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const categories = (await listCategories());

  let products = (await allProductsAdmin());
  if (typeof sp.q === "string" && sp.q) {
    const q = sp.q.toLowerCase();
    products = products.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (typeof sp.category === "string" && sp.category !== "all") {
    const cat = (await getCategoryBySlug(sp.category));
    if (cat) products = products.filter((p) => p.categoryIds.includes(cat.id));
  }
  if (typeof sp.status === "string" && sp.status !== "all") {
    products = products.filter((p) => p.status === sp.status);
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">Manage your catalog and supplier-sourced products.</p>
      </div>

      <ProductsFilterBar categories={categories} />
      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
