import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, relatedProducts, allProductsAdmin } from "@/lib/services/products-service";
import { ImageGallery } from "@/components/product/image-gallery";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ReviewsSection } from "@/components/product/reviews-section";
import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together";
import { RecordRecentlyViewed } from "@/components/product/record-recently-viewed";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductSection } from "@/components/home/product-section";
import { getSiteContent } from "@/lib/content/site-content";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export async function generateStaticParams() {
  return (await allProductsAdmin()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProduct(slug));
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images.map((i) => ({ url: i.url })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = (await getProduct(slug));
  if (!product) notFound();

  const related = (await relatedProducts(product, 4));
  const { productPage } = (await getSiteContent());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((i) => i.url),
    sku: product.variants[0]?.sku,
    aggregateRating: product.reviewCount
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: product.totalInventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecordRecentlyViewed productId={product.id} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageGallery images={product.images} title={product.title} />
        <AddToCartPanel product={product} shippingLine={productPage.shippingLine} returnsLine={productPage.returnsLine} />
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <Accordion type="multiple" defaultValue={["description"]}>
          <AccordionItem value="description">
            <AccordionTrigger>Product Details</AccordionTrigger>
            <AccordionContent>{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping</AccordionTrigger>
            <AccordionContent>
              {product.shipping.freeShipping ? "This item ships free. " : ""}
              {productPage.shippingLine} {productPage.shippingNote}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>Returns</AccordionTrigger>
            <AccordionContent>{productPage.returnsNote}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <FrequentlyBoughtTogether product={product} related={related} />
      <ReviewsSection product={product} />

      {related.length > 0 && <ProductSection eyebrow="You might also like" title="Related Products" products={related} viewAllHref="/shop" />}
      <RecentlyViewed excludeProductId={product.id} />
    </div>
  );
}
