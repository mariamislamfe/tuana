"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageField } from "./image-field";
import { createProductAction, editProductAction } from "@/app/admin/(dashboard)/products/actions";
import { toast } from "@/lib/store/toast-store";

export function ProductFormDialog({
  categories,
  product,
  open,
  onOpenChange,
}: {
  categories: Category[];
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [mainImage, setMainImage] = useState(product?.images[0]?.url ?? "");
  const [extraImages, setExtraImages] = useState<string[]>(product?.images.slice(1).map((i) => i.url) ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [bestSeller, setBestSeller] = useState(product?.bestSeller ?? false);
  const [newArrival, setNewArrival] = useState(product?.newArrival ?? !product);

  function handleSubmit(formData: FormData) {
    if (!mainImage) {
      toast({ title: "Add a main image", description: "Every product needs at least one photo.", variant: "danger" });
      return;
    }
    formData.set("imageUrl", mainImage);
    formData.delete("extraImageUrl");
    extraImages.filter(Boolean).forEach((u) => formData.append("extraImageUrl", u));
    formData.set("featured", featured ? "on" : "off");
    formData.set("bestSeller", bestSeller ? "on" : "off");
    formData.set("newArrival", newArrival ? "on" : "off");
    startTransition(async () => {
      if (product) await editProductAction(product.id, formData);
      else await createProductAction(formData);
      toast({ title: product ? "Product updated" : "Product created", variant: "success" });
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <DialogBody className="max-h-[68vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="title">Product title</Label>
                <Input id="title" name="title" required defaultValue={product?.title} />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" defaultValue={product?.brand ?? "Tuana"} />
              </div>
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select name="categoryId" defaultValue={product?.categoryIds[0] ?? categories[0]?.id}>
                  <SelectTrigger id="categoryId"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.group} · {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="shortDescription">Short description</Label>
                <Input id="shortDescription" name="shortDescription" required defaultValue={product?.shortDescription} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Full description</Label>
                <Textarea id="description" name="description" required defaultValue={product?.description} />
              </div>

              <div>
                <Label htmlFor="price">Price (EGP)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Compare-at price</Label>
                <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={product?.compareAtPrice} />
              </div>
              <div>
                <Label htmlFor="inventory">Inventory</Label>
                <Input id="inventory" name="inventory" type="number" min="0" required defaultValue={product?.variants[0]?.inventory ?? 0} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={product?.status ?? "active"}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
                {[
                  { label: "Featured", checked: featured, set: setFeatured },
                  { label: "Best seller", checked: bestSeller, set: setBestSeller },
                  { label: "New arrival", checked: newArrival, set: setNewArrival },
                ].map((t) => (
                  <label key={t.label} className="flex items-center justify-between rounded-sm border border-line px-3 py-2.5">
                    <span className="text-[13px] text-ink">{t.label}</span>
                    <Switch checked={t.checked} onCheckedChange={t.set} />
                  </label>
                ))}
              </div>

              <div className="sm:col-span-2">
                <Label>Main image</Label>
                <ImageField value={mainImage} onChange={setMainImage} aspect="aspect-[16/10]" />
              </div>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="mb-0">More images (gallery)</Label>
                  <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setExtraImages((l) => [...l, ""])}>
                    <Plus className="h-3.5 w-3.5" /> Add image
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {extraImages.map((url, i) => (
                    <div key={i} className="relative">
                      <ImageField value={url} onChange={(v) => setExtraImages((l) => l.map((x, k) => (k === i ? v : x)))} aspect="aspect-[4/3]" />
                      <button
                        type="button"
                        aria-label="Remove this image slot"
                        onClick={() => setExtraImages((l) => l.filter((_, k) => k !== i))}
                        className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper-raised/95 text-ink shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving..." : product ? "Save Changes" : "Create Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
