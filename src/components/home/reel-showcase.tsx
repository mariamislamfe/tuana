"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Sparkle } from "@/components/ui/sparkle";
import { IMG, img } from "@/lib/data/images";
import type { SiteContent } from "@/lib/content/types";

/** Shown when no video has been uploaded yet: three film-strip columns drifting in opposite directions. */
const COLLAGE: string[][] = [
  [IMG.amberDropper, IMG.nudeLipstick, IMG.ringsDish, IMG.clayMask],
  [IMG.roseGoldMakeup, IMG.guaSha, IMG.eyeshadowHand, IMG.facialMask],
  [IMG.brushSetPouch, IMG.dropperEucalyptus, IMG.goldHoop, IMG.spaDiffuser],
  [IMG.eyeshadowMauve, IMG.ringsLeaves, IMG.bathFlatlay, IMG.facialTreatment],
  [IMG.kraftTote, IMG.nailPolishRow, IMG.homeShelf, IMG.silverWatch],
];

function Collage() {
  return (
    <div className="reel-frame absolute inset-0 grid grid-cols-3 gap-2.5 px-2.5 sm:grid-cols-4 sm:gap-4 sm:px-4 lg:grid-cols-5">
      {COLLAGE.map((col, c) => (
        <div key={c} className={`overflow-hidden ${c === 3 ? "hidden sm:block" : c === 4 ? "hidden lg:block" : ""}`}>
          {/* The list is rendered twice so the -50% translate loops seamlessly. */}
          <div className={`reel-col flex flex-col gap-2.5 sm:gap-4 ${c === 1 ? "reverse" : ""}`} style={{ animationDuration: `${34 + c * 8}s` }}>
            {[...col, ...col].map((id, i) => (
              <div key={i} className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-sm">
                <Image src={img(id, 500, 660)} alt="" fill sizes="(min-width: 640px) 25vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReelShowcase({ reel }: { reel: SiteContent["home"]["reel"] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  if (!reel.enabled) return null;

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <Reveal scale>
        <div className="relative isolate aspect-[4/5] overflow-hidden rounded-md bg-ink sm:aspect-[16/9] lg:aspect-[21/9]">
          {reel.video ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={reel.video}
              poster={reel.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : (
            <Collage />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20 lg:bg-gradient-to-r lg:from-ink/85 lg:via-ink/45 lg:to-ink/10" />
          <Sparkle className="absolute right-[10%] top-[16%] h-6 w-6 text-paper/80" />
          <Sparkle className="absolute right-[22%] top-[34%] h-3.5 w-3.5 text-paper/70" delay={1100} />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-10 lg:max-w-2xl lg:p-14">
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-paper/85">
              <Sparkle className="h-2.5 w-2.5" /> {reel.eyebrow}
            </p>
            <h2 className="text-balance font-display text-4xl leading-[1.05] text-paper sm:text-5xl lg:text-6xl">{reel.heading}</h2>
            <p className="max-w-md text-[14.5px] leading-relaxed text-paper/85">{reel.body}</p>
            {reel.button.label && (
              <div>
                <Button asChild size="lg" variant="accent" className="btn-sheen">
                  <Link href={reel.button.href}>{reel.button.label}</Link>
                </Button>
              </div>
            )}
          </div>

          {reel.video && (
            <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
              <button onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:scale-105">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Mute video"} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:scale-105">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
