"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Plus, Copy, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ProductFormDialog } from "./product-form-dialog";
import { deleteProductAction, duplicateProductAction, toggleStatusAction, bulkAction } from "@/app/admin/(dashboard)/products/actions";
import { toast } from "@/lib/store/toast-store";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_VARIANT = { active: "success", draft: "neutral", archived: "warning" } as const;

export function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const allSelected = products.length > 0 && selected.length === products.length;

  function toggleAll() {
    setSelected(allSelected ? [] : products.map((p) => p.id));
  }
  function toggleOne(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function runBulk(action: "publish" | "unpublish" | "delete") {
    startTransition(async () => {
      await bulkAction(selected, action);
      toast({ title: `${selected.length} products updated`, variant: "success" });
      setSelected([]);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        {selected.length > 0 ? (
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-ink-2">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => runBulk("publish")}>Publish</Button>
            <Button size="sm" variant="outline" onClick={() => runBulk("unpublish")}>Unpublish</Button>
            <Button size="sm" variant="destructive" onClick={() => runBulk("delete")}>Delete</Button>
          </div>
        ) : (
          <p className="text-[13px] text-ink-3">{products.length} products</p>
        )}
        <Button size="sm" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting your filters, or add a new product." />
      ) : (
        <div className="overflow-x-auto rounded-md border border-line bg-paper-raised scrollbar-thin">
          <table className="w-full min-w-[880px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
                <th className="w-10 px-4 py-3"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></th>
                <th className="px-2 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Inventory</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => {
                const category = categories.find((c) => c.id === p.categoryIds[0]);
                return (
                  <tr key={p.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3"><Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleOne(p.id)} /></td>
                    <td className="px-2 py-3">
                      <Link href={`/product/${p.slug}`} target="_blank" className="flex items-center gap-3">
                        <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-xs bg-surface">
                          <Image src={p.images[0].url} alt="" fill sizes="36px" className="object-cover" />
                        </div>
                        <span className="max-w-[220px] truncate text-ink hover:underline">{p.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-2">{category?.name ?? "—"}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[p.status]} className="capitalize">{p.status}</Badge></td>
                    <td className={cn("px-4 py-3", p.totalInventory === 0 ? "text-danger" : p.totalInventory <= 10 ? "text-warning" : "text-ink-2")}>
                      {p.totalInventory}
                    </td>
                    <td className="px-4 py-3 text-ink">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 text-ink-3">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-xs hover:bg-surface">
                          <MoreHorizontal className="h-4 w-4 text-ink-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditing(p)} className="flex items-center gap-2">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => startTransition(async () => { await duplicateProductAction(p.id); toast({ title: "Product duplicated", variant: "success" }); })}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-3.5 w-3.5" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => startTransition(async () => { await toggleStatusAction(p.id, p.status === "active" ? "draft" : "active"); toast({ title: p.status === "active" ? "Unpublished" : "Published", variant: "success" }); })}
                            className="flex items-center gap-2"
                          >
                            {p.status === "active" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            {p.status === "active" ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => startTransition(async () => { await deleteProductAction(p.id); toast({ title: "Product deleted", variant: "success" }); })}
                            className="flex items-center gap-2 text-danger"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormDialog categories={categories} open={creating} onOpenChange={setCreating} />
      {editing && <ProductFormDialog categories={categories} product={editing} open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(undefined)} />}
    </div>
  );
}
