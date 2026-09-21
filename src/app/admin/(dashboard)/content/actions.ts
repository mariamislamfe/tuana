"use server";

import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { UPLOAD_DIR } from "@/lib/server/persist";
import { hasSupabase } from "@/lib/db/env";
import { serviceClient } from "@/lib/db/supabase-backend";
import { saveSiteContent, resetSiteContent } from "@/lib/content/site-content";
import type { SiteContent } from "@/lib/content/types";

const EDITABLE: (keyof SiteContent)[] = [
  "brand", "announcement", "nav", "home", "footer", "productPage",
  "about", "shipping", "returns", "contact", "privacy", "terms", "seo",
];

export interface ActionResult {
  ok: boolean;
  message?: string;
  url?: string;
}

/** Saves the given top-level sections (each one replaces the stored copy). */
export async function saveContentAction(patch: Partial<SiteContent>): Promise<ActionResult> {
  await requireAdmin();
  const clean: Partial<SiteContent> = {};
  for (const key of EDITABLE) {
    if (key in patch) (clean as Record<string, unknown>)[key] = patch[key];
  }
  await saveSiteContent(clean);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetContentAction(): Promise<ActionResult> {
  await requireAdmin();
  await resetSiteContent();
  revalidatePath("/", "layout");
  return { ok: true };
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const EXT: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif", "image/gif": ".gif" };
const MAX_BYTES = 8 * 1024 * 1024;

/** Stores an uploaded image (Supabase Storage bucket `media`, or data/uploads locally) and returns its public URL. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose an image first." };
  if (!ALLOWED.has(file.type)) return { ok: false, message: "Use a JPG, PNG, WebP, AVIF or GIF image." };
  if (file.size > MAX_BYTES) return { ok: false, message: "Image is larger than 8MB." };

  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${EXT[file.type]}`;

  if (hasSupabase()) {
    const sb = serviceClient();
    const { error } = await sb.storage.from("media").upload(name, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) return { ok: false, message: `Upload failed: ${error.message}` };
    return { ok: true, url: sb.storage.from("media").getPublicUrl(name).data.publicUrl };
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { ok: true, url: `/uploads/${name}` };
}

const VIDEO_EXT: Record<string, string> = { "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov" };
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

/** Stores an uploaded video (Supabase Storage `media` bucket, or data/uploads locally) and returns its URL. */
export async function uploadVideoAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a video first." };
  if (!VIDEO_EXT[file.type]) return { ok: false, message: "Use an MP4, WebM or MOV video." };
  if (file.size > MAX_VIDEO_BYTES) return { ok: false, message: "Video is larger than 50MB — compress it or paste a link instead." };

  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${VIDEO_EXT[file.type]}`;

  if (hasSupabase()) {
    const sb = serviceClient();
    const { error } = await sb.storage.from("media").upload(name, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) return { ok: false, message: `Upload failed: ${error.message}` };
    return { ok: true, url: sb.storage.from("media").getPublicUrl(name).data.publicUrl };
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { ok: true, url: `/uploads/${name}` };
}
