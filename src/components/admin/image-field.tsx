"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Upload, X, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/components/ui/dialog";
import { PRESET_IMAGES, img } from "@/lib/data/images";
import { uploadImageAction } from "@/app/admin/(dashboard)/content/actions";
import { toast } from "@/lib/store/toast-store";
import { cn } from "@/lib/utils";

/** Small, cached preview via the image optimizer so huge originals don't slow the dashboard. */
function previewSrc(url: string, width = 750) {
  return url.startsWith("http") || url.startsWith("/") ? `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=70` : url;
}

/**
 * One control for every image in the dashboard: upload a file, paste a URL,
 * or pick a preset. Reports the resulting URL/path through `onChange`.
 */
export function ImageField({
  value,
  onChange,
  aspect = "aspect-[4/3]",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
  className?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [presetsOpen, setPresetsOpen] = useState(false);

  function upload(file: File) {
    const form = new FormData();
    form.set("file", file);
    startTransition(async () => {
      const result = await uploadImageAction(form);
      if (result.ok && result.url) {
        onChange(result.url);
        toast({ title: "Image uploaded", variant: "success" });
      } else {
        toast({ title: "Upload failed", description: result.message, variant: "danger" });
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-sm border border-line bg-surface", aspect)}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
          <img src={previewSrc(value)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-3">
            <ImagePlus className="h-6 w-6" strokeWidth={1.4} />
            <span className="text-[12px]">No image</span>
          </div>
        )}
        {value && (
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper-raised/95 text-ink shadow-sm hover:bg-paper-raised"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" className="gap-1.5" disabled={pending} onClick={() => fileRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> {pending ? "Uploading…" : "Upload"}
        </Button>
        <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setPresetsOpen(true)}>
          <LayoutGrid className="h-3.5 w-3.5" /> Presets
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" className="h-9 text-[12.5px]" />

      <Dialog open={presetsOpen} onOpenChange={setPresetsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a preset image</DialogTitle>
          </DialogHeader>
          <DialogBody className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {PRESET_IMAGES.map((p) => {
                const url = img(p.id, 1600);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(url);
                      setPresetsOpen(false);
                    }}
                    className="group text-left"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-sm border border-line bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewSrc(img(p.id, 400), 384)} alt={p.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="mt-1.5 truncate text-[11.5px] text-ink-3">{p.label}</p>
                  </button>
                );
              })}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
