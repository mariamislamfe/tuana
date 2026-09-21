/** Supabase env vars. Both the new (publishable/secret) and legacy (anon/service_role) names work. */
export const supabaseEnv = {
  url: () => process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
  anonKey: () =>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    "",
  serviceKey: () => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || "",
};

export function hasSupabase() {
  return Boolean(supabaseEnv.url() && supabaseEnv.anonKey() && supabaseEnv.serviceKey());
}
