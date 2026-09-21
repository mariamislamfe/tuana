import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Product, ProductImage, ProductVariant, Category } from "@/lib/types";
import type { ProductInput } from "@/lib/data/products";
import type { CategoryInput } from "@/lib/data/categories";
import { slugify } from "@/lib/utils";

/**
 * App-facing catalog access. Everything is async because storage may be
 * Supabase; `cache()` de-duplicates reads within a single request (layout +
 * page both asking for categories, for example).
 */

const loadProducts = cache(() => db().products.list());
const loadCategories = cache(() => db().categories.list());

export interface ProductFilters {
  categorySlug?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  tag?: "new" | "bestseller";
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
}

// ── reads ─────────────────────────────────────────────────────────────
export async function listCategories() {
  return loadCategories();
}

export async function getCategoryBySlug(slug: string) {
  return (await loadCategories()).find((c) => c.slug === slug);
}

async function activeProducts() {
  return (await loadProducts()).filter((p) => p.status === "active");
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let list = await activeProducts();

  if (filters.categorySlug) {
    const cat = await getCategoryBySlug(filters.categorySlug);
    if (cat) list = list.filter((p) => p.categoryIds.includes(cat.id));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
    );
  }
  if (filters.minPrice !== undefined) list = list.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) list = list.filter((p) => p.price <= filters.maxPrice!);
  if (filters.inStockOnly) list = list.filter((p) => p.totalInventory > 0);
  if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating!);
  if (filters.tag === "new") list = list.filter((p) => p.newArrival);
  if (filters.tag === "bestseller") list = list.filter((p) => p.bestSeller);

  switch (filters.sort) {
    case "price-asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...list].sort((a, b) => b.price - a.price);
    case "newest":
      return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "rating":
      return [...list].sort((a, b) => b.rating - a.rating);
    default:
      return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export async function getProduct(slug: string) {
  return (await activeProducts()).find((p) => p.slug === slug);
}

export async function relatedProducts(product: Product, limit = 4) {
  return (await activeProducts())
    .filter((p) => p.id !== product.id && p.categoryIds.some((c) => product.categoryIds.includes(c)))
    .slice(0, limit);
}

export async function featuredProducts(limit = 8) {
  return (await activeProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function bestSellers(limit = 8) {
  return (await activeProducts()).filter((p) => p.bestSeller).slice(0, limit);
}

export async function newArrivals(limit = 8) {
  return (await activeProducts()).filter((p) => p.newArrival).slice(0, limit);
}

export async function searchSuggestions(query: string, limit = 6) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return (await activeProducts()).filter((p) => p.title.toLowerCase().includes(q)).slice(0, limit);
}

export async function productsByIds(ids: string[]) {
  return (await activeProducts()).filter((p) => ids.includes(p.id));
}

/** Every product regardless of status — admin only. */
export async function allProductsAdmin() {
  return loadProducts();
}

export async function inventoryRecords() {
  return (await loadProducts()).flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      variantId: v.id,
      productTitle: p.title,
      variantTitle: v.title === "Default" ? "" : v.title,
      sku: v.sku,
      image: p.images[0]?.url ?? "",
      localStock: v.inventory,
      lowStockThreshold: 10,
    }))
  );
}

// ── product writes (admin) ────────────────────────────────────────────
async function uniqueSlug(base: string, ignoreId?: string) {
  const all = await db().products.list();
  const root = slugify(base) || `product-${Date.now()}`;
  let slug = root;
  let n = 2;
  while (all.some((p) => p.slug === slug && p.id !== ignoreId)) slug = `${root}-${n++}`;
  return slug;
}

function imagesFor(id: string, input: ProductInput): ProductImage[] {
  return [input.imageUrl, ...(input.extraImageUrls ?? [])]
    .filter(Boolean)
    .map((url, i) => ({ id: `${id}-img-${i + 1}`, url, alt: input.title }));
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const id = `prod-${Date.now().toString(36)}`;
  const variant: ProductVariant = {
    id: `${id}-default`,
    sku: `${id.toUpperCase()}-DEF`,
    title: "Default",
    optionValues: {},
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    inventory: input.inventory,
  };
  const stamp = new Date().toISOString();
  const product: Product = {
    id,
    slug: await uniqueSlug(input.title),
    title: input.title,
    brand: input.brand,
    categoryIds: [input.categoryId],
    shortDescription: input.shortDescription,
    description: input.description,
    bullets: [],
    images: imagesFor(id, input),
    options: [],
    variants: [variant],
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    currency: "EGP",
    rating: 0,
    reviewCount: 0,
    reviews: [],
    tags: [],
    status: input.status,
    featured: input.featured ?? false,
    bestSeller: input.bestSeller ?? false,
    newArrival: input.newArrival ?? true,
    totalInventory: input.inventory,
    source: { supplier: "internal", syncStatus: "not_synced" },
    shipping: { freeShipping: input.price >= 75, estimatedDaysMin: 3, estimatedDaysMax: 7 },
    createdAt: stamp,
    updatedAt: stamp,
  };
  await db().products.upsert(product);
  return product;
}

export async function editProduct(id: string, input: ProductInput): Promise<Product | null> {
  const product = (await db().products.list()).find((p) => p.id === id);
  if (!product) return null;
  const variants = product.variants.map((v, i) => ({
    ...v,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    inventory: i === 0 ? input.inventory : v.inventory,
  }));
  const updated: Product = {
    ...product,
    title: input.title,
    slug: await uniqueSlug(input.title, id),
    brand: input.brand,
    categoryIds: [input.categoryId],
    shortDescription: input.shortDescription,
    description: input.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    status: input.status,
    featured: input.featured ?? product.featured,
    bestSeller: input.bestSeller ?? product.bestSeller,
    newArrival: input.newArrival ?? product.newArrival,
    images: imagesFor(id, input),
    variants,
    totalInventory: variants.reduce((s, v) => s + v.inventory, 0),
    updatedAt: new Date().toISOString(),
  };
  await db().products.upsert(updated);
  return updated;
}

export async function removeProduct(id: string) {
  await db().products.remove(id);
}

export async function cloneProduct(id: string): Promise<Product | null> {
  const source = (await db().products.list()).find((p) => p.id === id);
  if (!source) return null;
  const newId = `prod-${Date.now().toString(36)}`;
  const stamp = new Date().toISOString();
  const copy: Product = {
    ...source,
    id: newId,
    slug: await uniqueSlug(`${source.title} copy`),
    title: `${source.title} (Copy)`,
    status: "draft",
    featured: false,
    bestSeller: false,
    newArrival: false,
    variants: source.variants.map((v, i) => ({ ...v, id: `${newId}-v${i + 1}`, sku: `${v.sku}-COPY` })),
    createdAt: stamp,
    updatedAt: stamp,
  };
  await db().products.upsert(copy);
  return copy;
}

export async function toggleProductStatus(id: string, status: Product["status"]) {
  const product = (await db().products.list()).find((p) => p.id === id);
  if (!product) return null;
  const updated = { ...product, status, updatedAt: new Date().toISOString() };
  await db().products.upsert(updated);
  return updated;
}

// ── category writes (admin) ───────────────────────────────────────────
export async function createCategory(input: CategoryInput): Promise<Category> {
  const existing = await db().categories.list();
  let slug = slugify(input.name) || `category-${Date.now()}`;
  const root = slug;
  let n = 2;
  while (existing.some((c) => c.slug === slug)) slug = `${root}-${n++}`;
  const category: Category = { id: `cat-${slug}`, slug, ...input };
  await db().categories.upsert(category, { sort: existing.length });
  return category;
}

export async function editCategory(id: string, patch: Partial<CategoryInput>) {
  const category = (await db().categories.list()).find((c) => c.id === id);
  if (!category) return null;
  const updated = { ...category, ...patch };
  await db().categories.upsert(updated);
  return updated;
}

export async function removeCategory(id: string) {
  await db().categories.remove(id);
}
