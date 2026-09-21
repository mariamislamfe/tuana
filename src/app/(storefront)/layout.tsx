import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/toaster";
import { getSiteContent } from "@/lib/content/site-content";
import { listCategories, featuredProducts } from "@/lib/services/products-service";
import { getStoreSettings } from "@/lib/services/settings-service";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const content = (await getSiteContent());
  const categories = (await listCategories());
  const settings = await getStoreSettings();

  return (
    <>
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <AnnouncementBar announcement={content.announcement} />
      <Header
        brandName={content.brand.name}
        mark={content.brand.mark}
        categoriesLabel={content.nav.categoriesLabel}
        links={content.nav.links}
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name, group: c.group }))}
      />
      <main className="flex-1">{children}</main>
      <Footer brandName={content.brand.name} logo={content.brand.logo} footer={content.footer} categories={categories} />
      <CartDrawer recommended={await featuredProducts(6)} freeShippingThreshold={settings.freeShippingThreshold} />
      <Toaster />
    </>
  );
}
