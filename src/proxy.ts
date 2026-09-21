import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifySessionToken, ADMIN_COOKIE, CUSTOMER_COOKIE } from "@/lib/auth/session";
import { supabaseEnv, hasSupabase } from "@/lib/db/env";

const ADMIN_PUBLIC_PATHS = ["/admin/login"];
const CUSTOMER_PUBLIC_PATHS = ["/account/login", "/account/register"];

/**
 * Route guard. It only checks that *someone* is signed in — the role (admin vs
 * customer) is enforced in the pages/actions via `getCurrentUser` /
 * `requireAdmin`, because the role lives in the database.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin") && !ADMIN_PUBLIC_PATHS.includes(pathname);
  const isAccount = pathname.startsWith("/account") && !CUSTOMER_PUBLIC_PATHS.includes(pathname);

  let response = NextResponse.next({ request });
  let signedIn: boolean;

  if (hasSupabase()) {
    // Refreshes the Supabase session cookies when they are close to expiring.
    const supabase = createServerClient(supabaseEnv.url(), supabaseEnv.anonKey(), {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list) {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } else if (isAdmin) {
    signedIn = verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)?.role === "admin";
  } else {
    signedIn = verifySessionToken(request.cookies.get(CUSTOMER_COOKIE)?.value)?.role === "customer";
  }

  if ((isAdmin || isAccount) && !signedIn) {
    const url = new URL(isAdmin ? "/admin/login" : "/account/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
