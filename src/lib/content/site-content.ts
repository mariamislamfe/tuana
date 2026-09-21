import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/** Objects merge recursively; arrays and primitives are replaced wholesale. */
function merge<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) return (override === undefined ? base : override) as T;
  const out: Json = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = key in base ? merge((base as Json)[key], override[key]) : override[key];
  }
  return out as T;
}

/** Stored edits layered over defaults, so new default fields always appear. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  return merge(defaultContent(), await db().content.get());
});

export async function saveSiteContent(patch: Partial<SiteContent>) {
  await db().content.save(patch);
}

export async function resetSiteContent() {
  // Saving every top-level key as undefined drops the overrides in both backends.
  const empty: Json = {};
  for (const key of Object.keys(defaultContent())) empty[key] = undefined;
  await db().content.save(empty as Partial<SiteContent>);
}
