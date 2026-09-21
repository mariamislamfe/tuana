import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-ink-2 active:bg-ink",
        accent: "bg-accent text-paper hover:bg-accent-strong active:bg-accent-strong",
        outline: "border border-ink/70 text-ink bg-transparent hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-surface",
        subtle: "bg-surface text-ink hover:bg-line",
        link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink p-0 h-auto",
        destructive: "bg-danger text-paper hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] rounded-sm",
        md: "h-11 px-5 text-sm rounded-sm",
        lg: "h-[52px] px-7 text-[15px] rounded-sm",
        icon: "h-10 w-10 rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
