import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "@/lib/db/env";

/**
 * Supabase client bound to the visitor's auth cookies (anon key). Use it for
 * sign-in / sign-up / sign-out and to read who is logged in. It cannot bypass
 * RLS — privileged reads/writes go through `serviceClient()` after checking
 * the user's role.
 */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(supabaseEnv.url(), supabaseEnv.anonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component (read-only cookies) — the proxy refreshes the session instead.
        }
      },
    },
  });
}
