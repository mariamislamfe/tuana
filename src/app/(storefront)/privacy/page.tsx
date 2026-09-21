import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/site-content";
import { LegalPage } from "@/components/layout/faq-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const { privacy } = (await getSiteContent());
  return <LegalPage heading={privacy.heading} updated={privacy.updated} sections={privacy.sections} />;
}
