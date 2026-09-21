import Link from "next/link";
import { Sparkle } from "@/components/ui/sparkle";
import type { SiteContent } from "@/lib/content/types";

export function AnnouncementBar({ announcement }: { announcement: SiteContent["announcement"] }) {
  if (!announcement.enabled || !announcement.text.trim()) return null;

  const inner = (
    <span className="flex items-center justify-center gap-3 px-4 py-2.5 text-center text-[12.5px] tracking-wide text-paper">
      <Sparkle className="h-2.5 w-2.5 text-accent-soft" />
      {announcement.text}
      <Sparkle className="h-2.5 w-2.5 text-accent-soft" delay={900} />
    </span>
  );

  return (
    <div className="bg-ink">
      {announcement.href ? (
        <Link href={announcement.href} className="block transition-opacity hover:opacity-85">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
