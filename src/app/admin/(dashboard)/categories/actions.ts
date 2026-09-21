"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { CategoryInput } from "@/lib/data/categories";
import { allProductsAdmin, createCategory, editCategory, removeCategory } from "@/lib/services/products-service";

function parse(formData: FormData): CategoryInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    group: String(formData.get("group") ?? "").trim() || "Shop",
    description: String(formData.get("description") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    featured: formData.get("featured") === "on",
  };
}

function refresh() {
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name) return { ok: false, message: "Give the category a name." };
  await createCategory(input);
  refresh();
  return { ok: true };
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const input = parse(formData);
  if (!input.name) return { ok: false, message: "Give the category a name." };
  await editCategory(id, input);
  refresh();
  return { ok: true };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  if ((await allProductsAdmin()).some((p) => p.categoryIds.includes(id))) {
    return { ok: false, message: "Move or delete this category's products first." };
  }
  await removeCategory(id);
  refresh();
  return { ok: true };
}
