"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateStoreSettings } from "@/lib/services/settings-service";
import { hasSupabase } from "@/lib/db/env";
import { fileDb } from "@/lib/db/file-backend";
import { supabaseDb } from "@/lib/db/supabase-backend";

export async function updateStoreSettingsAction(formData: FormData) {
  await requireAdmin();
  await updateStoreSettings({
    storeName: String(formData.get("storeName") ?? ""),
    supportEmail: String(formData.get("supportEmail") ?? ""),
    currency: String(formData.get("currency") ?? "EGP"),
    timezone: String(formData.get("timezone") ?? ""),
    freeShippingThreshold: Number(formData.get("freeShippingThreshold") ?? 0),
    flatShippingRate: Number(formData.get("flatShippingRate") ?? 0),
    taxRate: Number(formData.get("taxRate") ?? 0),
    lowStockThreshold: Number(formData.get("lowStockThreshold") ?? 0),
    orderNotifications: formData.get("orderNotifications") === "on",
    lowStockNotifications: formData.get("lowStockNotifications") === "on",
  });
  revalidatePath("/admin/settings");
}

/**
 * One-click import of the demo catalogue (products, categories, coupons,
 * settings, sample orders are NOT copied) into Supabase. Safe to re-run: rows
 * are upserted by id.
 */
export async function seedSupabaseAction(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  if (!hasSupabase()) return { ok: false, message: "Supabase is not configured." };
  try {
    const [products, categories, coupons, settings] = await Promise.all([
      fileDb.products.list(),
      fileDb.categories.list(),
      fileDb.coupons.list(),
      fileDb.settings.get(),
    ]);
    for (const [i, c] of categories.entries()) await supabaseDb.categories.upsert(c, { sort: i });
    for (const p of products) await supabaseDb.products.upsert(p);
    for (const c of coupons) await supabaseDb.coupons.upsert(c);
    await supabaseDb.settings.save(settings);
    return { ok: true, message: `Imported ${products.length} products, ${categories.length} categories, ${coupons.length} coupons.` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Import failed." };
  }
}
