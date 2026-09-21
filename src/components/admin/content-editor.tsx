"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/content/types";
import { CONTENT_TABS, type FieldSpec, type SectionSpec } from "@/lib/content/editor-spec";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "./image-field";
import { VideoField } from "./video-field";
import { saveContentAction, resetContentAction } from "@/app/admin/(dashboard)/content/actions";
import { toast } from "@/lib/store/toast-store";

type Json = Record<string, unknown>;

function emptyFor(fields: FieldSpec[]): Json {
  const out: Json = {};
  for (const f of fields) {
    if (f.kind === "toggle") out[f.key] = false;
    else if (f.kind === "group") out[f.key] = emptyFor(f.fields);
    else if (f.kind === "list") out[f.key] = [];
    else out[f.key] = "";
  }
  return out;
}

function FieldEditor({ spec, value, onChange }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${spec.key}-${spec.label}`.replace(/\W+/g, "-");

  if (spec.kind === "text") {
    return (
      <div>
        <Label htmlFor={id}>{spec.label}</Label>
        <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        {spec.help && <p className="mt-1 text-[12px] text-ink-3">{spec.help}</p>}
      </div>
    );
  }

  if (spec.kind === "textarea") {
    return (
      <div>
        <Label htmlFor={id}>{spec.label}</Label>
        <Textarea id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="min-h-24" />
      </div>
    );
  }

  if (spec.kind === "toggle") {
    return (
      <label className="flex items-center justify-between rounded-sm border border-line px-3.5 py-3">
        <span className="text-[13.5px] text-ink">{spec.label}</span>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </label>
    );
  }

  if (spec.kind === "image") {
    return (
      <div>
        <Label>{spec.label}</Label>
        <ImageField value={String(value ?? "")} onChange={onChange} aspect="aspect-[16/8]" />
        {spec.help && <p className="mt-1 text-[12px] text-ink-3">{spec.help}</p>}
      </div>
    );
  }

  if (spec.kind === "video") {
    return (
      <div>
        <Label>{spec.label}</Label>
        <VideoField value={String(value ?? "")} onChange={onChange} />
        {spec.help && <p className="mt-1 text-[12px] text-ink-3">{spec.help}</p>}
      </div>
    );
  }

  if (spec.kind === "group") {
    const obj = (value ?? {}) as Json;
    return (
      <fieldset className="rounded-md border border-line p-4">
        <legend className="px-2 text-[12.5px] font-semibold uppercase tracking-wider text-ink-3">{spec.label}</legend>
        <div className="flex flex-col gap-4">
          {spec.fields.map((f) => (
            <FieldEditor key={f.key} spec={f} value={obj[f.key]} onChange={(v) => onChange({ ...obj, [f.key]: v })} />
          ))}
        </div>
      </fieldset>
    );
  }

  if (spec.kind !== "list") return null;
  const items = (Array.isArray(value) ? value : []) as Json[];
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="mb-0">{spec.label}</Label>
        <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => onChange([...items, emptyFor(spec.fields)])}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <p className="rounded-sm border border-dashed border-line-strong px-3 py-4 text-center text-[12.5px] text-ink-3">Nothing here yet.</p>}
        {items.map((item, i) => (
          <div key={i} className="rounded-sm border border-line bg-paper-raised p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-medium text-ink-3">
                {spec.itemTitle} {i + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded-xs text-ink-3 hover:bg-surface hover:text-ink disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded-xs text-ink-3 hover:bg-surface hover:text-ink disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" aria-label="Remove" onClick={() => onChange(items.filter((_, k) => k !== i))} className="flex h-7 w-7 items-center justify-center rounded-xs text-ink-3 hover:bg-danger-soft hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {spec.fields.map((f) => (
                <FieldEditor key={f.key} spec={f} value={item[f.key]} onChange={(v) => onChange(items.map((it, k) => (k === i ? { ...it, [f.key]: v } : it)))} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ section, value, onChange }: { section: SectionSpec; value: unknown; onChange: (v: unknown) => void }) {
  const obj = (value ?? {}) as Json;
  return (
    <Card>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>{section.title}</CardTitle>
        {section.description && <p className="text-[12.5px] text-ink-3">{section.description}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {section.fields.map((f) => (
          <FieldEditor key={f.key} spec={f} value={obj[f.key]} onChange={(v) => onChange({ ...obj, [f.key]: v })} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ContentEditor({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState<SiteContent>(initial);
  const [pending, startTransition] = useTransition();

  const dirtyKeys = (tabId: string) => {
    const tab = CONTENT_TABS.find((t) => t.id === tabId)!;
    return tab.sections.map((s) => s.key).filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k]));
  };

  function save(tabId: string) {
    const keys = dirtyKeys(tabId);
    if (keys.length === 0) return;
    const patch: Partial<SiteContent> = {};
    for (const k of keys) (patch as Json)[k] = draft[k];
    startTransition(async () => {
      const res = await saveContentAction(patch);
      if (res.ok) {
        setSaved((s) => ({ ...s, ...patch }));
        toast({ title: "Content saved", description: "Your changes are live on the site.", variant: "success" });
      } else {
        toast({ title: "Couldn't save", description: res.message, variant: "danger" });
      }
    });
  }

  function reset() {
    if (!window.confirm("Reset ALL site content back to the defaults? This can't be undone.")) return;
    startTransition(async () => {
      await resetContentAction();
      window.location.reload();
    });
  }

  return (
    <Tabs defaultValue={CONTENT_TABS[0].id}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <TabsList>
          {CONTENT_TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
              {dirtyKeys(t.id).length > 0 && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-ink-3" onClick={reset} disabled={pending}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset to defaults
        </Button>
      </div>

      {CONTENT_TABS.map((tab) => {
        const dirty = dirtyKeys(tab.id).length;
        return (
          <TabsContent key={tab.id} value={tab.id} className="pt-6">
            <div className="flex max-w-3xl flex-col gap-5 pb-24">
              {tab.sections.map((section) => (
                <SectionCard key={section.key} section={section} value={draft[section.key]} onChange={(v) => setDraft((d) => ({ ...d, [section.key]: v }) as SiteContent)} />
              ))}
            </div>
            <div className="sticky bottom-4 z-20 mt-2 flex max-w-3xl items-center justify-between gap-3 rounded-md border border-line bg-paper-raised px-4 py-3 shadow-md">
              <p className="text-[13px] text-ink-3">{dirty > 0 ? `${dirty} section${dirty > 1 ? "s" : ""} with unsaved changes` : "All changes saved"}</p>
              <Button onClick={() => save(tab.id)} disabled={pending || dirty === 0}>
                {pending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
