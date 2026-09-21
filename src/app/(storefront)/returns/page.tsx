import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/site-content";
import { FaqPage } from "@/components/layout/faq-page";

export const metadata: Metadata = { title: "Returns" };

export default async function ReturnsPage() {
  const { returns } = (await getSiteContent());
  return <FaqPage heading={returns.heading} items={returns.items} />;
}
