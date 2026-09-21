"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "./image-field";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/admin/(dashboard)/categories/actions";
import { toast } from "@/lib/store/toast-store";

export function CategoryEditDialog({
  category,
  groups,
  open,
  onOpenChange,
}: {
  category?: Category;
  groups: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [featured, setFeatured] = useState(category?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");

  function handleSubmit(formData: FormData) {
    formData.set("featured", featured ? "on" : "off");
    formData.set("imageUrl", imageUrl);
    startTransition(async () => {
      const res = category ? await updateCategoryAction(category.id, formData) : await createCategoryAction(formData);
      if (!res.ok) {
        toast({ title: "Couldn't save", description: res.message, variant: "danger" });
        return;
      }
      toast({ title: category ? "Category updated" : "Category created", variant: "success" });
      onOpenChange(false);
    });
  }

  function handleDelete() {
    if (!category || !window.confirm(`Delete “${category.name}”?`)) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(category.id);
      if (!res.ok) {
        toast({ title: "Can't delete", description: res.message, variant: "danger" });
        return;
      }
      toast({ title: "Category deleted", variant: "success" });
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <DialogBody className="flex max-h-[68vh] flex-col gap-4 overflow-y-auto scrollbar-thin">
            <div>
              <Label>Image</Label>
              <ImageField value={imageUrl} onChange={setImageUrl} aspect="aspect-[16/9]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required defaultValue={category?.name} />
              </div>
              <div>
                <Label htmlFor="group">Group</Label>
                <Input id="group" name="group" list="category-groups" defaultValue={category?.group ?? groups[0]} placeholder="Skincare, Makeup…" />
                <datalist id="category-groups">
                  {groups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={category?.description} />
            </div>
            <label className="flex items-center justify-between rounded-sm border border-line px-3.5 py-3">
              <span className="text-[13.5px] text-ink">Featured on homepage</span>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </label>
          </DialogBody>
          <DialogFooter>
            {category && (
              <Button type="button" variant="ghost" className="mr-auto text-danger" onClick={handleDelete} disabled={pending}>
                Delete
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
