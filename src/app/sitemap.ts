import type { MetadataRoute } from "next";
import { allProductsAdmin, listCategories } from "@/lib/services/products-service";

const BASE_URL = "https://tuana.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = (await listCategories()).map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = (await allProductsAdmin())
    .filter((p) => p.status === "active")
    .map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
