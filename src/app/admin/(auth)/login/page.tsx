"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { loginAdminAction, type AdminLoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AdminLoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2 font-display text-2xl text-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.jpg" alt="" className="h-16 w-auto rounded-md" />
            Tuana
          </Link>
          <p className="mt-1.5 text-[13px] text-ink-3">Admin Dashboard</p>
        </div>

        <div className="rounded-md border border-line bg-paper-raised p-7">
          <div className="mb-5 flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-ink-3" />
            <h1 className="text-[15px] font-semibold text-ink">Sign in</h1>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required defaultValue="admin@tuana.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required defaultValue="tuana-admin-2026" />
            </div>

            {state.error && <p className="text-[13px] text-danger">{state.error}</p>}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[12px] text-ink-3">
            Demo credentials are pre-filled. In production this would be a real, invite-only admin login.
          </p>
        </div>

        <Link href="/" className="mt-5 block text-center text-[13px] text-ink-3 hover:text-ink">
          &larr; Back to store
        </Link>
      </div>
    </div>
  );
}
