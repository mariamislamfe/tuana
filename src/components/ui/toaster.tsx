"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/lib/store/toast-store";
import { cn } from "@/lib/utils";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  danger: AlertCircle,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={4200}>
      {toasts.map((t) => {
        const Icon = ICONS[t.variant ?? "default"];
        return (
          <ToastPrimitive.Root
            key={t.id}
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={cn(
              "flex items-start gap-3 rounded-md border border-line bg-paper-raised px-4 py-3.5 shadow-lg data-[state=open]:animate-rise data-[swipe=end]:animate-fade-in",
              "data-[state=closed]:animate-fade-in"
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 size-[18px] shrink-0",
                t.variant === "success" && "text-success",
                t.variant === "danger" && "text-danger",
                (!t.variant || t.variant === "default") && "text-ink-2"
              )}
            />
            <div className="grid gap-0.5">
              <ToastPrimitive.Title className="text-sm font-medium text-ink">{t.title}</ToastPrimitive.Title>
              {t.description && <ToastPrimitive.Description className="text-[13px] text-ink-3">{t.description}</ToastPrimitive.Description>}
            </div>
            <ToastPrimitive.Close className="ml-auto text-ink-3 hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2.5 p-4 sm:p-6" />
    </ToastPrimitive.Provider>
  );
}
