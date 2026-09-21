"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Crossfading hero slideshow — each image slowly zooms while it is on screen. */
export function HeroSlides({ images, alt, interval = 6500 }: { images: string[]; alt: string; interval?: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <>
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div key={src + i} className={cn("absolute inset-0 transition-opacity duration-[1600ms] ease-in-out", i === active ? "opacity-100" : "opacity-0")} aria-hidden={i !== active}>
            {/* Re-keying on activation restarts the zoom each time the slide returns. */}
            <div key={i === active ? "on" : "off"} className={cn("absolute inset-0", i === active && "slide-zoom")}>
              <Image src={src} alt={i === 0 ? alt : ""} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 right-4 z-10 flex gap-2 sm:bottom-8 sm:right-8" role="tablist" aria-label="Hero slides">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={cn("h-[3px] rounded-full bg-paper transition-all duration-500", i === active ? "w-8 opacity-100" : "w-4 opacity-50")} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
