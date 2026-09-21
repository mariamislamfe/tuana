"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAdminAction, type AdminLoginState } from "@/app/admin/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <div className="rounded-md border border-line bg-paper-raised p-7">
      <div className="mb-5 flex items-center gap-2.5">
        <Lock className="h-4 w-4 text-ink-3" />
        <h1 className="text-[15px] font-semibold text-ink">Sign in</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>

        {state.error && <p className="text-[13px] text-danger">{state.error}</p>}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
