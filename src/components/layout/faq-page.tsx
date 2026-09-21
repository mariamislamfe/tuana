import { Reveal } from "@/components/ui/reveal";

export function FaqPage({ heading, items }: { heading: string; items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="anim-rise font-display text-4xl text-ink">{heading}</h1>
      <div className="mt-10 flex flex-col divide-y divide-line">
        {items.map((f, i) => (
          <Reveal key={f.q + i} delay={i * 70} className="py-5">
            <p className="text-[15px] font-medium text-ink">{f.q}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{f.a}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function LegalPage({ heading, updated, sections }: { heading: string; updated: string; sections: { title: string; body: string }[] }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="anim-rise font-display text-4xl text-ink">{heading}</h1>
      <p className="mt-3 text-[13px] text-ink-3">{updated}</p>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s, i) => (
          <Reveal key={s.title + i} delay={i * 60}>
            <h2 className="text-[15px] font-semibold text-ink">{s.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
