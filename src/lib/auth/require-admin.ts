import "server-only";
import { getCurrentUser, type AppUser } from "./current-user";

/**
 * Server Actions are public HTTP endpoints — the route proxy only protects
 * page URLs — so every admin action must call this first.
 */
export async function requireAdmin(): Promise<AppUser> {
  const user = await getCurrentUser("admin");
  if (!user) throw new Error("Unauthorized");
  return user;
}
