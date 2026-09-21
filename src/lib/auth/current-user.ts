import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { hasSupabase } from "@/lib/db/env";
import { supabaseServer } from "@/lib/supabase/server";
import { resolveRole, type Role } from "./roles";
import { verifySessionToken, ADMIN_COOKIE, CUSTOMER_COOKIE } from "./session";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Who is signed in, for the given area.
 *  - Supabase mode: one Supabase Auth session; the role comes from `profiles`.
 *  - Demo mode (no Supabase env): the two signed cookies (admin / customer).
 * `kind` keeps the areas separate: an admin never counts as a customer here
 * and vice versa.
 */
export const getCurrentUser = cache(async (kind: Role): Promise<AppUser | null> => {
  if (hasSupabase()) {
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { role, name } = await resolveRole(user);
    if (role !== kind) return null;
    return { id: user.id, email: user.email ?? "", name, role };
  }

  const store = await cookies();
  const session = verifySessionToken(store.get(kind === "admin" ? ADMIN_COOKIE : CUSTOMER_COOKIE)?.value);
  if (!session || session.role !== kind) return null;
  return { id: session.sub, email: session.email, name: session.name, role: kind };
});
