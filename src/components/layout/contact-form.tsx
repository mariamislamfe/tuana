"use client";

import { useState } from "react";
import { Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { toast } from "@/lib/store/toast-store";
import type { SiteContent } from "@/lib/content/types";

export function ContactForm({ contact }: { contact: SiteContent["contact"] }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Message sent", description: "We'll get back to you within one business day.", variant: "success" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="anim-rise font-display text-4xl text-ink">{contact.heading}</h1>
      <p className="anim-rise mt-3 text-[14.5px] text-ink-2" style={{ "--d": "120ms" } as React.CSSProperties}>{contact.intro}</p>

      <div className="anim-rise mt-6 flex flex-col gap-2 text-[13.5px] text-ink-2" style={{ "--d": "220ms" } as React.CSSProperties}>
        <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-ink-3" /> {contact.email}</p>
        <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-ink-3" /> {contact.hours}</p>
      </div>

      {submitted ? (
        <div className="anim-rise mt-10 rounded-md border border-line bg-surface px-6 py-8 text-center">
          <p className="text-[15px] font-medium text-ink">Thanks — your message is on its way.</p>
          <p className="mt-1.5 text-[13.5px] text-ink-3">We&apos;ll reply to the email you provided shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required className="min-h-36" />
          </div>
          <Button type="submit" size="lg" className="btn-sheen mt-1 w-fit">Send Message</Button>
        </form>
      )}
    </div>
  );
}
