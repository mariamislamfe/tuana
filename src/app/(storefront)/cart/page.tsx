import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { featuredProducts } from "@/lib/services/products-service";
import { getStoreSettings } from "@/lib/services/settings-service";

export const metadata: Metadata = { title: "Your Bag" };

export default async function CartPage() {
  const s = await getStoreSettings();
  return (
    <CartView
      recommended={await featuredProducts(6)}
      rules={{ freeShippingThreshold: s.freeShippingThreshold, flatShippingRate: s.flatShippingRate, taxRate: s.taxRate }}
    />
  );
}
