"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findCustomerByEmail, verifyCustomerPassword, registerCustomer } from "@/lib/auth/customer-accounts";
import { createSessionToken, CUSTOMER_COOKIE } from "@/lib/auth/session";
import { hasSupabase } from "@/lib/db/env";
import { supabaseServer } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
}

async function establishSession(id: string, name: string, email: string) {
  const token = createSessionToken({ sub: id, role: "customer", name, email });
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function loginCustomerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (hasSupabase()) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: "Invalid email or password." };
    redirect("/account");
  }

  const user = findCustomerByEmail(email);
  if (!user || !verifyCustomerPassword(user, password)) {
    return { error: "Invalid email or password." };
  }

  await establishSession(user.id, user.name, user.email);
  redirect("/account");
}

export async function registerCustomerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    return { error: "Please fill out every field — password must be at least 8 characters." };
  }

  if (hasSupabase()) {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return { error: error.message };
    // With "Confirm email" enabled in Supabase there is no session yet.
    if (!data.session) return { error: "Almost there — check your inbox to confirm your email, then sign in." };
    redirect("/account");
  }

  if (findCustomerByEmail(email)) {
    return { error: "An account with that email already exists." };
  }

  const user = registerCustomer(name, email, password);
  await establishSession(user.id, user.name, user.email);
  redirect("/account");
}

export async function logoutCustomerAction() {
  if (hasSupabase()) {
    const sb = await supabaseServer();
    await sb.auth.signOut();
  }
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
  redirect("/account/login");
}
