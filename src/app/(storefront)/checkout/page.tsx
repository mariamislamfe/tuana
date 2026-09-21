import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { getStoreSettings } from "@/lib/services/settings-service";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const s = await getStoreSettings();
  return <CheckoutView rules={{ freeShippingThreshold: s.freeShippingThreshold, flatShippingRate: s.flatShippingRate, taxRate: s.taxRate }} />;
}
