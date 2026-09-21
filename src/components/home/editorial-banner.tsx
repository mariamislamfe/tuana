import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { SiteContent } from "@/lib/content/types";

export function EditorialBanner({ editorial }: { editorial: SiteContent["home"]["editorial"] }) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-md bg-surface lg:grid-cols-2">
        <Reveal className="relative order-2 aspect-[4/3] overflow-hidden lg:order-1 lg:aspect-auto" scale>
          {editorial.image && (
            <Image src={editorial.image} alt={editorial.heading} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] hover:scale-105" />
          )}
        </Reveal>
        <Reveal className="order-1 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:order-2" delay={150}>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">{editorial.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">{editorial.heading}</h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2">{editorial.body}</p>
          <Button asChild variant="outline" className="mt-7 w-fit">
            <Link href={editorial.button.href}>{editorial.button.label}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
