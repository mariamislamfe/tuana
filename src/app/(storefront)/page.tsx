import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ValueProps } from "@/components/home/value-props";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductSection } from "@/components/home/product-section";
import { EditorialBanner } from "@/components/home/editorial-banner";
import { ReelShowcase } from "@/components/home/reel-showcase";
import { Newsletter } from "@/components/home/newsletter";
import { getSiteContent } from "@/lib/content/site-content";
import { listCategories, bestSellers, newArrivals } from "@/lib/services/products-service";

export default async function HomePage() {
  const { home } = (await getSiteContent());
  const featuredCategories = (await listCategories()).filter((c) => c.featured);

  return (
    <>
      <Hero hero={home.hero} />
      <Marquee items={home.marquee.items} />
      <ValueProps items={home.valueProps} />
      <CategoryGrid categories={featuredCategories} eyebrow={home.categories.eyebrow} heading={home.categories.heading} />
      <ProductSection eyebrow={home.bestSellers.eyebrow} title={home.bestSellers.heading} products={(await bestSellers(8))} viewAllHref="/shop?tag=bestseller" />
      <EditorialBanner editorial={home.editorial} />
      <ReelShowcase reel={home.reel} />
      <ProductSection eyebrow={home.newArrivals.eyebrow} title={home.newArrivals.heading} products={(await newArrivals(8))} viewAllHref="/shop?tag=new" />
      <Newsletter newsletter={home.newsletter} />
    </>
  );
}
