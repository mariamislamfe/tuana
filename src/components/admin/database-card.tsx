"use client";

import { useState, useTransition } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { seedSupabaseAction } from "@/app/admin/(dashboard)/settings/actions";
import { toast } from "@/lib/store/toast-store";

export function DatabaseCard({ kind }: { kind: "supabase" | "file" }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function seed() {
    startTransition(async () => {
      const res = await seedSupabaseAction();
      setMessage(res.message);
      toast({ title: res.ok ? "Import finished" : "Import failed", description: res.message, variant: res.ok ? "success" : "danger" });
    });
  }

  return (
    <Card>
      <CardHeader><CardTitle>Database</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3 text-[13.5px] text-ink-2">
        <p className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-success" />
          {kind === "supabase" ? "Connected to Supabase." : "Local demo mode (JSON files). Add Supabase keys to .env.local to go live."}
        </p>
        {kind === "supabase" && (
          <>
            <p className="text-ink-3">Copy the demo products, categories, coupons and settings into your Supabase project. Safe to run more than once.</p>
            <div><Button size="sm" onClick={seed} disabled={pending}>{pending ? "Importing…" : "Import demo catalogue"}</Button></div>
            {message && <p className="text-[12.5px] text-ink-3">{message}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
