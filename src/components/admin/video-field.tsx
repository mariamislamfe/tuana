"use client";

import { useRef, useState, useTransition } from "react";
import { Film, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadVideoAction } from "@/app/admin/(dashboard)/content/actions";
import { toast } from "@/lib/store/toast-store";

/** Upload an MP4/WebM, or paste a link to one. Reports the URL through `onChange`. */
export function VideoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function upload(file: File) {
    const form = new FormData();
    form.set("file", file);
    startTransition(async () => {
      try {
        const result = await uploadVideoAction(form);
        if (result.ok && result.url) {
          setFailed(false);
          onChange(result.url);
          toast({ title: "Video uploaded", variant: "success" });
        } else {
          toast({ title: "Upload failed", description: result.message, variant: "danger" });
        }
      } catch {
        toast({ title: "Upload failed", description: "The file may be too large for the server.", variant: "danger" });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-sm border border-line bg-surface">
        {value && !failed ? (
          <video key={value} src={value} muted loop playsInline autoPlay controls className="h-full w-full object-cover" onError={() => setFailed(true)} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-3">
            <Film className="h-6 w-6" strokeWidth={1.4} />
            <span className="text-[12px]">{value ? "Can’t preview this link" : "No video"}</span>
          </div>
        )}
        {value && (
          <button
            type="button"
            aria-label="Remove video"
            onClick={() => { onChange(""); setFailed(false); }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper-raised/95 text-ink shadow-sm hover:bg-paper-raised"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" className="gap-1.5" disabled={pending} onClick={() => fileRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> {pending ? "Uploading…" : "Upload video"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      <Input value={value} onChange={(e) => { setFailed(false); onChange(e.target.value); }} placeholder="…or paste a video link (.mp4 / .webm)" className="h-9 text-[12.5px]" />
    </div>
  );
}
