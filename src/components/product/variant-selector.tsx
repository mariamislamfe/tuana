"use client";

import type { ProductOption, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

export function findVariant(variants: ProductVariant[], selected: Record<string, string>) {
  return variants.find((v) => Object.entries(v.optionValues).every(([k, val]) => selected[k] === val));
}

export function VariantSelector({
  options,
  variants,
  selected,
  onChange,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  selected: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <div key={option.name}>
          <p className="mb-2 text-[13px] font-medium text-ink">
            {option.name}
            <span className="ml-1.5 font-normal text-ink-3">{selected[option.name]}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const candidate = { ...selected, [option.name]: value };
              const variant = findVariant(variants, candidate);
              const isSelected = selected[option.name] === value;
              const isAvailable = variant ? variant.inventory > 0 : true;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange(candidate)}
                  disabled={!isAvailable}
                  className={cn(
                    "min-w-11 rounded-xs border px-3.5 py-2 text-[13px] transition-colors",
                    isSelected ? "border-ink bg-ink text-paper" : "border-line-strong text-ink hover:border-ink",
                    !isAvailable && "cursor-not-allowed border-line text-ink-3 line-through opacity-50 hover:border-line"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
