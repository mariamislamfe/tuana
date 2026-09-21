import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { getStoreSettings } from "@/lib/services/settings-service";
import { getSiteContent } from "@/lib/content/site-content";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [s, content] = await Promise.all([getStoreSettings(), getSiteContent()]);
  return (
    <CheckoutView
      rules={{ freeShippingThreshold: s.freeShippingThreshold, flatShippingRate: s.flatShippingRate, taxRate: s.taxRate }}
      brandName={content.brand.name}
    />
  );
}
