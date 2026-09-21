import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-strong py-20 text-center", className)}>
      <Icon className="h-8 w-8 text-ink-3" strokeWidth={1.3} />
      <div>
        <p className="text-[15px] font-medium text-ink">{title}</p>
        {description && <p className="mt-1 max-w-xs text-sm text-ink-3">{description}</p>}
      </div>
      {action}
    </div>
  );
}
