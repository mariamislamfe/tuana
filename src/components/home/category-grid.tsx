import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";
import { Sparkle } from "@/components/ui/sparkle";

export function CategoryGrid({ categories, eyebrow, heading }: { categories: Category[]; eyebrow: string; heading: string }) {
  if (categories.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <Reveal className="mb-8">
        <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">
          <Sparkle className="h-2.5 w-2.5 text-accent" /> {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{heading}</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-5">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 110} scale>
            <Link href={`/category/${c.slug}`} className="group relative block aspect-[16/11] overflow-hidden sm:aspect-[4/5] rounded-md bg-surface">
              {c.imageUrl && (
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent transition-opacity duration-500 group-hover:from-ink/70" />
              <span className="absolute right-3 top-3 flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-paper-raised/90 text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 group-hover:-translate-y-1 sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-paper/70">{c.group}</p>
                <h3 className="font-display text-2xl text-paper sm:text-[28px]">{c.name}</h3>
                <p className="mt-1 hidden text-[13px] text-paper/80 sm:block">{c.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
