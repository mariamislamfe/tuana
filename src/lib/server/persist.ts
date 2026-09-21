import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Tiny disk-backed store used for everything the dashboard can edit
 * (products, categories, coupons, settings, site content). Values live in
 * `data/<name>.json`, are cached on `globalThis` so every module instance
 * (RSC, actions, route handlers, HMR reloads) shares one copy, and are only
 * written when a mutation calls `save()`.
 *
 * Swap this file for a real database client when you connect one — callers
 * only use `persistedStore(...).get()/save()`.
 *
 * `version` invalidates a stored file when the seed data shape changes.
 */
export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

interface Wrapper<T> {
  version: number;
  data: T;
}

const g = globalThis as unknown as { __tuanaStores?: Map<string, unknown> };
const stores: Map<string, unknown> = (g.__tuanaStores ??= new Map());

function fileFor(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function persistedStore<T>(name: string, version: number, seed: () => T) {
  const key = `${name}@${version}`;
  if (!stores.has(key)) {
    let value: T | undefined;
    try {
      const raw = JSON.parse(fs.readFileSync(fileFor(name), "utf8")) as Wrapper<T>;
      if (raw.version === version) value = raw.data;
    } catch {
      // no file yet, or unreadable — fall back to seed
    }
    stores.set(key, value ?? seed());
  }

  return {
    get: () => stores.get(key) as T,
    save: () => {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const payload: Wrapper<T> = { version, data: stores.get(key) as T };
        fs.writeFileSync(fileFor(name), JSON.stringify(payload, null, 2), "utf8");
      } catch (err) {
        console.error(`[persist] could not write ${name}.json`, err);
      }
    },
  };
}
