import type { Metadata } from "next";
import { listCategories, allProductsAdmin } from "@/lib/services/products-service";
import { CategoriesGrid } from "./categories-grid";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const categories = (await listCategories());
  const products = (await allProductsAdmin());
  const counts: Record<string, number> = {};
  for (const c of categories) counts[c.id] = products.filter((p) => p.categoryIds.includes(c.id)).length;

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Categories</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">{categories.length} categories</p>
      </div>
      <CategoriesGrid categories={categories} counts={counts} />
    </div>
  );
}
