import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/sparkle";
import { HeroSlides } from "./hero-slides";
import type { SiteContent } from "@/lib/content/types";

export function Hero({ hero }: { hero: SiteContent["home"]["hero"] }) {
  return (
    <section className="relative h-[92vh] min-h-[600px] max-h-[880px] w-full overflow-hidden bg-surface">
      {hero.video ? (
        <video
          key={hero.video}
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.video}
          poster={hero.image || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <HeroSlides images={[hero.image, ...(hero.slides ?? []).map((sl) => sl.image)].filter(Boolean)} alt={hero.headline} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-ink/10 to-transparent" />

      <Sparkle className="absolute right-[12%] top-[22%] h-7 w-7 text-paper/80" />
      <Sparkle className="absolute right-[24%] top-[38%] h-4 w-4 text-paper/70" delay={900} />
      <Sparkle className="anim-float absolute right-[8%] top-[52%] h-5 w-5 text-paper/60" delay={1700} />

      <div className="relative flex h-full max-w-[1440px] flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20 lg:mx-auto lg:px-10 lg:pb-24">
        <p className="anim-rise mb-4 text-[12px] font-medium uppercase tracking-[0.2em] text-paper/85" style={{ "--d": "150ms" } as React.CSSProperties}>
          {hero.eyebrow}
        </p>
        <h1 className="anim-rise max-w-2xl text-balance font-display text-[46px] leading-[1.02] text-paper sm:text-6xl lg:text-[80px]" style={{ "--d": "300ms" } as React.CSSProperties}>
          {hero.headline}
        </h1>
        <p className="anim-rise mt-5 max-w-md text-[15px] leading-relaxed text-paper/90 sm:text-base" style={{ "--d": "500ms" } as React.CSSProperties}>
          {hero.subtext}
        </p>
        <div className="anim-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "700ms" } as React.CSSProperties}>
          <Button asChild size="lg" variant="accent" className="btn-sheen">
            <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-paper/60 text-paper hover:bg-paper hover:text-ink">
            <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
