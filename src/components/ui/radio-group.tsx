"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = ({ className, ...props }: RadioGroupPrimitive.RadioGroupProps) => (
  <RadioGroupPrimitive.Root className={cn("grid gap-2.5", className)} {...props} />
);

export function RadioGroupItem({ className, ...props }: RadioGroupPrimitive.RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full border border-line-strong bg-paper-raised data-[state=checked]:border-ink",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-ink" />
    </RadioGroupPrimitive.Item>
  );
}
