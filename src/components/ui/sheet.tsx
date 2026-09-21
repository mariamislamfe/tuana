"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sideClasses = {
  right: "right-0 top-0 h-full w-full max-w-md border-l data-[state=open]:animate-[slide-in-right_0.3s_cubic-bezier(0.16,1,0.3,1)]",
  left: "left-0 top-0 h-full w-full max-w-sm border-r",
  bottom: "bottom-0 left-0 w-full max-h-[85vh] border-t rounded-t-lg",
};

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: DialogPrimitive.DialogContentProps & { side?: "right" | "left" | "bottom"; showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col border-line bg-paper shadow-lg outline-none",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1.5 text-ink-3 transition-colors hover:bg-surface hover:text-ink">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between border-b border-line px-5 py-4", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={cn("font-display text-lg text-ink", className)} {...props} />;
}
