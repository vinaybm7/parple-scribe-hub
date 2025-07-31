import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ctaGlowVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:scale-105 border border-white/20 backdrop-blur-sm",
        outline: "border-2 border-purple-500 bg-white/10 backdrop-blur-xl text-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:scale-105 hover:bg-purple-500/20 transition-all duration-300",
        ghost: "text-purple-600 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-2xl px-10 py-5 text-lg",
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