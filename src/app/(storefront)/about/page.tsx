import type { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/lib/content/site-content";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { about } = (await getSiteContent());

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="anim-rise text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">{about.eyebrow}</p>
      <h1 className="anim-rise mt-3 font-display text-4xl text-ink sm:text-5xl" style={{ "--d": "120ms" } as React.CSSProperties}>
        {about.heading}
      </h1>
      {about.paragraphs[0] && (
        <p className="anim-rise mt-6 text-[15px] leading-relaxed text-ink-2" style={{ "--d": "240ms" } as React.CSSProperties}>
          {about.paragraphs[0].text}
        </p>
      )}
      {about.image && (
        <Reveal className="relative my-10 aspect-[16/9] overflow-hidden rounded-md bg-surface" scale>
          <Image src={about.image} alt={about.heading} fill sizes="100vw" className="object-cover" />
        </Reveal>
      )}
      {about.paragraphs.slice(1).map((p, i) => (
        <Reveal key={i} delay={i * 100}>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{p.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
