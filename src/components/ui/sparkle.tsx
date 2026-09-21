import { cn } from "@/lib/utils";

/** Four-point star echoing the Tuana mark; twinkles softly. */
export function Sparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("anim-twinkle h-4 w-4 fill-current", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
    </svg>
  );
}
