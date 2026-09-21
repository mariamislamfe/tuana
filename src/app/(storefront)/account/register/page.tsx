"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerCustomerAction, type AuthState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthState = {};

export default function AccountRegisterPage() {
  const [state, formAction, pending] = useActionState(registerCustomerAction, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Create an account</h1>
      <p className="mt-1.5 text-[14px] text-ink-3">Faster checkout and order tracking.</p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>

        {state.error && <p className="text-[13px] text-danger">{state.error}</p>}

        <Button type="submit" size="lg" className="mt-1" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-ink-3">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
