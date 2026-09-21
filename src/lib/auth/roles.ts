import "server-only";
import { serviceClient } from "@/lib/db/supabase-backend";

export type Role = "admin" | "customer";

/** Comma-separated emails that are promoted to admin the first time they sign in. */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Looks up a Supabase user's role in `profiles`. Emails listed in
 * ADMIN_EMAILS are promoted automatically (only once the email is verified),
 * which is how the very first admin is created without touching SQL.
 */
export async function resolveRole(user: { id: string; email?: string | null; email_confirmed_at?: string | null; user_metadata?: Record<string, unknown> }) {
  const sb = serviceClient();
  const { data: profile } = await sb.from("profiles").select("role, full_name").eq("id", user.id).maybeSingle();

  let role: Role = profile?.role === "admin" ? "admin" : "customer";
  const email = (user.email ?? "").toLowerCase();

  if (role !== "admin" && email && user.email_confirmed_at && adminEmails().includes(email)) {
    role = "admin";
    await sb.from("profiles").upsert({ id: user.id, email, role: "admin", full_name: profile?.full_name ?? "" }, { onConflict: "id" });
  }

  const meta = user.user_metadata?.full_name;
  const name = profile?.full_name || (typeof meta === "string" && meta) || email.split("@")[0] || "Customer";
  return { role, name };
}
