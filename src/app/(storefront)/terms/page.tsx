import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/site-content";
import { LegalPage } from "@/components/layout/faq-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const { terms } = (await getSiteContent());
  return <LegalPage heading={terms.heading} updated={terms.updated} sections={terms.sections} />;
}
