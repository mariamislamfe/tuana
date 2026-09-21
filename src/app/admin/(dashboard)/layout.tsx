import { getCurrentUser } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/ui/toaster";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser("admin");

  return (
    <AdminShell adminName={user?.name ?? "Admin"}>
      {children}
      <Toaster />
    </AdminShell>
  );
}
