"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { logoutAdminAction } from "@/app/admin/(auth)/login/actions";

export function AdminShell({ adminName, brandName, children }: { adminName: string; brandName: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-paper-raised lg:flex">
        <Link href="/admin" className="flex items-center gap-2 px-6 py-6">
          <span className="font-display text-xl text-ink">{brandName}</span>
          <span className="rounded-xs bg-surface px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-3">Admin</span>
        </Link>
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-6">
          <SidebarNav />
        </div>
        <div className="border-t border-line p-4">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-sm px-2 py-2 text-[12.5px] text-ink-3 hover:bg-surface hover:text-ink">
            <ExternalLink className="h-3.5 w-3.5" /> View store
          </Link>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-64 p-0">
          <SheetHeader>
            <SheetTitle>{brandName} Admin</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-sm hover:bg-surface lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 outline-none hover:bg-surface">
              <Avatar name={adminName} size="sm" />
              <span className="hidden text-[13px] font-medium text-ink sm:block">{adminName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={logoutAdminAction}>
                <button type="submit" className="flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
