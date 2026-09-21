"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "3 Months" },
  { value: "all", label: "All Time" },
];

export function DateRangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "30d";

  function setRange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-sm border border-line bg-paper-raised p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={cn(
            "rounded-xs px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            current === r.value ? "bg-ink text-paper" : "text-ink-2 hover:bg-surface"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
