import type { Category } from "@/lib/types";
import { img, IMG } from "./images";

export const seedCategories = (): Category[] => [
  { id: "cat-skincare", slug: "skincare", name: "Skincare", group: "Shop", description: "Cleansers, serums, moisturizers, and masks — a routine that keeps skin calm and glowing.", imageUrl: img(IMG.amberDropper, 900, 1100), featured: true },
  { id: "cat-makeup", slug: "makeup", name: "Makeup", group: "Shop", description: "Face, eyes, lips, and nails in soft, wearable shades.", imageUrl: img(IMG.roseGoldMakeup, 900, 1100), featured: true },
  { id: "cat-accessories", slug: "accessories", name: "Accessories", group: "Shop", description: "Jewelry, bags, hair pieces, and beauty tools for every day.", imageUrl: img(IMG.ringsDish, 900, 1100), featured: true },
];

export interface CategoryInput {
  name: string;
  group: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}
