"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/reveal";
import { Sparkle } from "@/components/ui/sparkle";
import { toast } from "@/lib/store/toast-store";
import type { SiteContent } from "@/lib/content/types";

export function Newsletter({ newsletter }: { newsletter: SiteContent["home"]["newsletter"] }) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast({ title: newsletter.successTitle, description: newsletter.successBody, variant: "success" });
    setEmail("");
  }

  return (
    <section className="relative overflow-hidden border-t border-line bg-ink">
      <Sparkle className="absolute left-[10%] top-10 h-6 w-6 text-paper/30" />
      <Sparkle className="absolute bottom-12 right-[12%] h-8 w-8 text-paper/25" delay={1200} />
      <Reveal className="relative mx-auto max-w-[1440px] px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-paper/60">{newsletter.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-lg font-display text-3xl text-paper sm:text-4xl">{newsletter.heading}</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] text-paper/70">{newsletter.body}</p>
        <form onSubmit={handleSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-paper/20 bg-paper/10 text-paper placeholder:text-paper/50 focus:border-paper/60"
          />
          <Button type="submit" variant="accent" className="btn-sheen sm:w-fit sm:shrink-0">
            {newsletter.buttonLabel}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
