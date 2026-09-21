"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ContentLink } from "@/lib/content/types";
import { groupCategories, type NavCategory } from "./nav-utils";

export function MobileNav({
  open,
  onOpenChange,
  brandName,
  links,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  links: ContentLink[];
  categories: NavCategory[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="max-w-xs">
        <SheetHeader>
          <SheetTitle>{brandName}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} onClick={() => onOpenChange(false)} className="border-b border-line py-3.5 text-[15px] font-medium text-ink">
                {l.label}
              </Link>
            ))}
          </div>

          {groupCategories(categories).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{group}</p>
              <div className="flex flex-col">
                {items.map((c) => (
                  <Link key={c.id} href={`/category/${c.slug}`} onClick={() => onOpenChange(false)} className="border-b border-line py-3 text-sm text-ink-2">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link href="/account" onClick={() => onOpenChange(false)} className="mt-6 flex items-center gap-2.5 rounded-sm bg-surface px-3.5 py-3 text-sm font-medium text-ink">
            <User className="h-4 w-4" />
            Account
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
