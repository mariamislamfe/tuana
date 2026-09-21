"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createProduct, editProduct, removeProduct, cloneProduct, toggleProductStatus } from "@/lib/services/products-service";
import type { ProductInput } from "@/lib/data/products";

function parseInput(formData: FormData): ProductInput {
  const compareAtRaw = formData.get("compareAtPrice");
  const extra = formData.getAll("extraImageUrl").map(String).filter(Boolean);
  return {
    title: String(formData.get("title") ?? "").trim(),
    brand: String(formData.get("brand") ?? "Tuana").trim(),
    categoryId: String(formData.get("categoryId") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price")),
    compareAtPrice: compareAtRaw ? Number(compareAtRaw) : undefined,
    inventory: Number(formData.get("inventory") ?? 0),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    extraImageUrls: extra,
    status: (formData.get("status") as ProductInput["status"]) ?? "active",
    featured: formData.get("featured") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    newArrival: formData.get("newArrival") === "on",
  };
}

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  await createProduct(parseInput(formData));
  refresh();
}

export async function editProductAction(id: string, formData: FormData) {
  await requireAdmin();
  await editProduct(id, parseInput(formData));
  refresh();
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await removeProduct(id);
  refresh();
}

export async function duplicateProductAction(id: string) {
  await requireAdmin();
  await cloneProduct(id);
  refresh();
}

export async function toggleStatusAction(id: string, status: "active" | "draft" | "archived") {
  await requireAdmin();
  await toggleProductStatus(id, status);
  refresh();
}

export async function bulkAction(ids: string[], action: "publish" | "unpublish" | "delete") {
  await requireAdmin();
  for (const id of ids) {
    if (action === "publish") await toggleProductStatus(id, "active");
    else if (action === "unpublish") await toggleProductStatus(id, "draft");
    else await removeProduct(id);
  }
  refresh();
}
