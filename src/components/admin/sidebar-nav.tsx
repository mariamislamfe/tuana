"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  ShoppingCart,
  Package,
  Tags,
  Warehouse,
  Megaphone,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content", href: "/admin/content", icon: LayoutTemplate },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-[13.5px] transition-colors",
              active ? "border-accent bg-surface font-medium text-ink" : "border-transparent text-ink-2 hover:bg-surface hover:text-ink"
            )}
          >
            <item.icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
