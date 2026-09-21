import "server-only";
import { db } from "@/lib/db";
import type { StoreSettings } from "@/lib/data/store-settings";

export async function getStoreSettings(): Promise<StoreSettings> {
  return db().settings.get();
}

export async function updateStoreSettings(patch: Partial<StoreSettings>) {
  const next = { ...(await db().settings.get()), ...patch };
  await db().settings.save(next);
  return next;
}
