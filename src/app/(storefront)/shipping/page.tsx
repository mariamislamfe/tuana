import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/site-content";
import { FaqPage } from "@/components/layout/faq-page";

export const metadata: Metadata = { title: "Shipping" };

export default async function ShippingPage() {
  const { shipping } = (await getSiteContent());
  return <FaqPage heading={shipping.heading} items={shipping.items} />;
}
