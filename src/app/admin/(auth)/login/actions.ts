"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findAdminByEmail, verifyAdminPassword } from "@/lib/auth/admin-users";
import { createSessionToken, ADMIN_COOKIE } from "@/lib/auth/session";
import { resolveRole } from "@/lib/auth/roles";
import { hasSupabase } from "@/lib/db/env";
import { supabaseServer } from "@/lib/supabase/server";

export interface AdminLoginState {
  error?: string;
}

export async function loginAdminAction(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (hasSupabase()) {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: "Invalid email or password." };
    const { role } = await resolveRole(data.user);
    if (role !== "admin") {
      await sb.auth.signOut();
      return { error: "This account does not have admin access." };
    }
    redirect("/admin");
  }

  const user = findAdminByEmail(email);
  if (!user || !verifyAdminPassword(user, password)) {
    return { error: "Invalid email or password." };
  }

  const token = createSessionToken({ sub: user.id, role: "admin", name: user.name, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAdminAction() {
  if (hasSupabase()) {
    const sb = await supabaseServer();
    await sb.auth.signOut();
  }
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
