import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedBorderButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 group",
  {
    variants: {
      variant: {
        default: "cta-gradient text-white font-bold",
        outline: "border-2 border-purple-500 bg-transparent text-purple-500",
        ghost: "text-purple-500",
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

export interface AnimatedBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedBorderButtonVariants> {
  asChild?: boolean;
}

const AnimatedBorderButton = React.forwardRef<HTMLButtonElement, AnimatedBorderButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <div className="relative flex items-center justify-center">
        {/* Animated border layers */}
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[2px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[400px] before:h-[400px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-0
                        before:bg-[conic-gradient(transparent,#8B5CF6_20%,transparent_40%,transparent_60%,#A855F7_80%,transparent)] before:transition-all before:duration-3000 before:ease-linear
                        group-hover:before:rotate-[360deg]">
        </div>
        
        <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[1px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[300px] before:h-[300px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45
                        before:bg-[conic-gradient(transparent,#C084FC_30%,transparent_70%)] before:transition-all before:duration-2000 before:ease-linear
                        group-hover:before:rotate-[405deg]">
        </div>

        <Comp
          className={cn(animatedBorderButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      </div>
    );
  }
);
AnimatedBorderButton.displayName = "AnimatedBorderButton";

export { AnimatedBorderButton, animatedBorderButtonVariants };