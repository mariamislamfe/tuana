import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/services/settings-service";
import { adminUsers } from "@/lib/auth/admin-users";
import { SettingsForm } from "@/components/admin/settings-form";
import { DatabaseCard } from "@/components/admin/database-card";
import { db } from "@/lib/db";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings — Admin" };

export default async function AdminSettingsPage() {
  const storeSettings = await getStoreSettings();
  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Settings</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">Store configuration, team access, and security.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Store</TabsTrigger>
          <TabsTrigger value="team">Admin Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="max-w-2xl pt-7">
          <SettingsForm settings={storeSettings} />
          <div className="mt-8"><DatabaseCard kind={db().kind} /></div>
        </TabsContent>

        <TabsContent value="team" className="max-w-2xl pt-7">
          <div className="flex flex-col divide-y divide-line rounded-md border border-line bg-paper-raised">
            {adminUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} />
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{u.name}</p>
                    <p className="text-[12.5px] text-ink-3">{u.email}</p>
                  </div>
                </div>
                <Badge variant="neutral" className="capitalize">{u.role}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] text-ink-3">
            Inviting new admins requires an email provider — wire one up, then extend{" "}
            <code className="rounded-xs bg-surface px-1 py-0.5">lib/auth/admin-users.ts</code>.
          </p>
        </TabsContent>

        <TabsContent value="security" className="max-w-2xl pt-7">
          <Card>
            <CardHeader><CardTitle>Session Security</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-[13.5px] text-ink-2">
              <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Admin sessions use signed, httpOnly cookies (HMAC-SHA256).</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Passwords are hashed with bcrypt — never stored in plain text.</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Admin and customer areas are isolated at the routing layer.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
