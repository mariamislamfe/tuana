import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({ name, className, size = "md" }: { name: string; className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-7 w-7 text-[11px]", md: "h-9 w-9 text-[12px]", lg: "h-12 w-12 text-sm" };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ink font-medium text-paper",
        sizes[size],
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
