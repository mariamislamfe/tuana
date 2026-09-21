import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const ICONS = [Truck, RotateCcw, ShieldCheck, Sparkles];

export function ValueProps({ items }: { items: { title: string; body: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-line sm:grid-flow-col sm:auto-cols-fr sm:divide-y-0 sm:divide-x">
        {items.map((p, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={p.title + i} delay={i * 120} className="flex items-center gap-3.5 px-6 py-6 sm:justify-center sm:px-4">
              <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} />
              <div>
                <p className="text-[13.5px] font-medium text-ink">{p.title}</p>
                <p className="text-[12.5px] text-ink-3">{p.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
