import { NextResponse } from "next/server";
import { allProductsAdmin, searchSuggestions } from "@/lib/services/products-service";

/** Public, read-only lookup used by client components (search, wishlist, recently viewed). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  const q = searchParams.get("q");

  if (ids) {
    const wanted = ids.split(",").filter(Boolean).slice(0, 40);
    const products = (await allProductsAdmin()).filter((p) => p.status === "active" && wanted.includes(p.id));
    return NextResponse.json({ products });
  }

  if (q) {
    return NextResponse.json({ products: (await searchSuggestions(q, 6)).filter((p) => p.status === "active") });
  }

  return NextResponse.json({ products: [] });
}
