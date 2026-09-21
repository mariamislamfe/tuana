import { createHmac, timingSafeEqual } from "crypto";

/**
 * Minimal signed-cookie session — no external auth provider wired up yet.
 * Swap for NextAuth/Supabase Auth/etc. later; only this file and the two
 * `actions.ts` files that call it would need to change.
 */

export interface SessionPayload {
  sub: string; // user id
  role: "admin" | "customer";
  name: string;
  email: string;
}

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSessionToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = "tuana_admin_session";
export const CUSTOMER_COOKIE = "tuana_customer_session";
