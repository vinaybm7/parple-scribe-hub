import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ctaGlowVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:shadow-[0_0_60px_rgba(139,92,246,0.8)] hover:scale-105 hover:from-purple-400 hover:to-violet-500",
        outline: "border border-purple-500 bg-transparent text-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:scale-105 hover:bg-purple-500/10",
        ghost: "text-purple-500 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-xl px-10 py-5 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CTAGlowProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaGlowVariants> {
  asChild?: boolean;
}

const CTAGlow = React.forwardRef<HTMLButtonElement, CTAGlowProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(ctaGlowVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CTAGlow.displayName = "CTAGlow";

export { CTAGlow, ctaGlowVariants };