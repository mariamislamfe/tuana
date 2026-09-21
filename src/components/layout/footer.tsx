import Link from "next/link";
import type { Category } from "@/lib/types";
import type { SiteContent } from "@/lib/content/types";

export function Footer({ brandName, logo, footer, categories }: { brandName: string; logo?: string; footer: SiteContent["footer"]; categories: Category[] }) {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={brandName} className="h-28 w-auto rounded-md" />
            ) : (
              <p className="font-display text-3xl text-ink">{brandName}</p>
            )}
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-ink-3">{footer.description}</p>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Shop</p>
            <ul className="flex flex-col gap-2.5 text-[13.5px] text-ink-2">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="transition-colors hover:text-ink">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Support</p>
            <ul className="flex flex-col gap-2.5 text-[13.5px] text-ink-2">
              <li><Link href="/shipping" className="transition-colors hover:text-ink">Shipping</Link></li>
              <li><Link href="/returns" className="transition-colors hover:text-ink">Returns</Link></li>
              <li><Link href="/account" className="transition-colors hover:text-ink">Track an order</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-ink">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">Company</p>
            <ul className="flex flex-col gap-2.5 text-[13.5px] text-ink-2">
              <li><Link href="/about" className="transition-colors hover:text-ink">About</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-ink">Contact</Link></li>
              <li><Link href="/admin" className="transition-colors hover:text-ink">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[12.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {footer.companyName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
