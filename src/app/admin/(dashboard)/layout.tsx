import { getCurrentUser } from "@/lib/auth/current-user";
import { getSiteContent } from "@/lib/content/site-content";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/ui/toaster";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, content] = await Promise.all([getCurrentUser("admin"), getSiteContent()]);

  return (
    <AdminShell adminName={user?.name ?? "Admin"} brandName={content.brand.name}>
      {children}
      <Toaster />
    </AdminShell>
  );
}
