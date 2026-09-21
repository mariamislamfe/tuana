import { Sparkle } from "@/components/ui/sparkle";

/** Slow, pausable ticker. The list is doubled so the -50% loop is seamless. */
export function Marquee({ items }: { items: { text: string }[] }) {
  const clean = items.filter((i) => i.text.trim());
  if (clean.length === 0) return null;
  const loop = [...clean, ...clean, ...clean, ...clean];

  return (
    <div className="marquee border-b border-line bg-surface/60 py-3.5" aria-label="Highlights">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {loop.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap font-display text-[19px] italic text-ink-2">
                {item.text}
                <Sparkle className="mx-8 h-3 w-3 text-accent" delay={(i % 5) * 400} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
