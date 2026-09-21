"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentLink } from "@/lib/content/types";
import { CartButton } from "./cart-button";
import { WishlistButton } from "./wishlist-button";
import { SearchDialog } from "./search-dialog";
import { MobileNav } from "./mobile-nav";
import { groupCategories, type NavCategory } from "./nav-utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export interface HeaderProps {
  brandName: string;
  mark?: string;
  categoriesLabel: string;
  links: ContentLink[];
  categories: NavCategory[];
}

export function Header({ brandName, mark, categoriesLabel, links, categories }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (y > lastY.current && y > 160) setHidden(true);
        else setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const grouped = groupCategories(categories);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-paper/95 backdrop-blur transition-all duration-300",
          scrolled ? "border-line shadow-sm" : "border-transparent",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className={cn("mx-auto flex max-w-[1440px] items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-10", scrolled ? "h-16" : "h-20")}>
          <div className="flex items-center gap-1 lg:hidden">
            <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface">
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

          <Link href="/" className="group flex items-center gap-2.5 font-display text-[26px] font-medium tracking-tight text-ink lg:flex-1">
            {mark && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mark} alt="" className={cn("w-auto rounded-sm transition-all duration-300", scrolled ? "h-9" : "h-11")} />
            )}
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-0.5">{brandName}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-sm px-3.5 py-2 text-[13.5px] font-medium text-ink-2 outline-none transition-colors hover:bg-surface hover:text-ink">
                {categoriesLabel}
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-60">
                {grouped.map(([group, items]) => (
                  <div key={group}>
                    <DropdownMenuLabel>{group}</DropdownMenuLabel>
                    {items.map((c) => (
                      <DropdownMenuItem key={c.id} asChild>
                        <Link href={`/category/${c.slug}`}>{c.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="link-underline rounded-sm px-3.5 py-2 text-[13.5px] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-0.5 lg:flex-none">
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface">
              <Search className="h-[19px] w-[19px]" strokeWidth={1.6} />
            </button>
            <Link href="/account" aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface sm:flex">
              <User className="h-[19px] w-[19px]" strokeWidth={1.6} />
            </Link>
            <WishlistButton className="hidden sm:flex" />
            <CartButton />
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} brandName={brandName} links={links} categories={categories} />
    </>
  );
}
