import "server-only";
import { hasSupabase } from "./env";
import { fileDb } from "./file-backend";
import { supabaseDb } from "./supabase-backend";
import type { Db } from "./types";

/** Supabase when its env vars are set; local JSON files otherwise. */
export function db(): Db {
  return hasSupabase() ? supabaseDb : fileDb;
}

export type { Db } from "./types";
