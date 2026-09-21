import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getSiteContent } from "@/lib/content/site-content";
import { ContentEditor } from "@/components/admin/content-editor";

export const metadata: Metadata = { title: "Content — Admin" };

export default async function AdminContentPage() {
  const content = (await getSiteContent());

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Content</h1>
          <p className="mt-0.5 max-w-xl text-[13px] text-ink-3">
            Every image and piece of text on the storefront — the hero, headings, menu, footer, and pages. Changes go live as soon as you save.
            Product and category photos are edited under Products and Categories.
          </p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-1.5 rounded-sm border border-line px-3 py-2 text-[13px] text-ink-2 hover:bg-surface hover:text-ink">
          <ExternalLink className="h-3.5 w-3.5" /> View site
        </Link>
      </div>

      <ContentEditor initial={content} />
    </div>
  );
}
