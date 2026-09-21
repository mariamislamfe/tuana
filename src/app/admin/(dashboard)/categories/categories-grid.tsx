"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import type { Category } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryEditDialog } from "@/components/admin/category-edit-dialog";

export function CategoriesGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const groups = Array.from(new Set(categories.map((c) => c.group)));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> New Category
        </Button>
      </div>

      {groups.map((group) => (
        <section key={group}>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-3">{group}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter((c) => c.group === group)
              .map((c) => (
                <div key={c.id} className="overflow-hidden rounded-md border border-line bg-paper-raised">
                  <div className="relative aspect-[16/9] bg-surface">
                    {c.imageUrl && <Image src={c.imageUrl} alt="" fill sizes="360px" className="object-cover" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14.5px] font-medium text-ink">{c.name}</p>
                        <p className="text-[12.5px] text-ink-3">/{c.slug}</p>
                      </div>
                      <button onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`} className="flex h-8 w-8 items-center justify-center rounded-xs text-ink-3 hover:bg-surface hover:text-ink">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12.5px] text-ink-2">{c.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="neutral">{counts[c.id] ?? 0} products</Badge>
                      {c.featured && <Badge variant="accent">Featured</Badge>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {editing && <CategoryEditDialog key={editing.id} category={editing} groups={groups} open onOpenChange={(o) => !o && setEditing(null)} />}
      {creating && <CategoryEditDialog groups={groups} open onOpenChange={(o) => !o && setCreating(false)} />}
    </div>
  );
}
