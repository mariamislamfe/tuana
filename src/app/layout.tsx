import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content/site-content";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, brand } = (await getSiteContent());
  return {
    metadataBase: new URL("https://tuana.example.com"),
    title: { default: seo.title, template: `%s — ${brand.name}` },
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, siteName: brand.name, type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
