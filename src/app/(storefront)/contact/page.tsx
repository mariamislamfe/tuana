import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/site-content";
import { ContactForm } from "@/components/layout/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { contact } = (await getSiteContent());
  return <ContactForm contact={contact} />;
}
