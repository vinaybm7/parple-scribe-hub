import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FloatingHeader from "./FloatingHeader";
import { BackgroundGradientAnimation } from "./BackgroundGradientAnimation";

const Hero = () => {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(108, 0, 162)"
      gradientBackgroundEnd="rgb(0, 17, 82)"
      firstColor="147, 51, 234"
      secondColor="221, 74, 255"
      thirdColor="168, 85, 247"
      fourthColor="192, 132, 252"
      fifthColor="196, 181, 253"
      pointerColor="147, 51, 234"
    >
      <FloatingHeader />
      <div className="relative z-50 container mx-auto px-4 text-center pt-32 pb-16 min-h-screen flex items-center justify-center">
        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-16">
          <h1 className="font-bricolage text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-foreground mt-16 mb-12">
            From{" "}
            <span className="text-gradient font-extrabold">Scattered</span>{" "}
            <span className="text-foreground font-extrabold">Notes,</span>
            <br />
            to{" "}
            <span className="relative inline-block group">
              {/* Purple gradient background behind "Systematic" */}
              <span className="absolute inset-0 hero-gradient-accent rounded-3xl transform -skew-y-1 scale-110 z-0 opacity-30"></span>
              <span className="relative z-10 bg-white px-8 py-4 rounded-3xl shadow-lg border border-border/20 inline-block mx-2 transform -rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105 cursor-pointer">
                <span className="text-foreground font-bold">Systematic</span>
              </span>
            </span>{" "}
            <span className="text-foreground font-extrabold">Success</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
            Transform your engineering study chaos into organized, searchable knowledge 
            that actually helps you succeed.
          </p>

          {/* CTA Button */}
          <div className="mt-20">
            <Button 
              size="lg" 
              variant="gradient"
              className="text-lg px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Organize Your Studies Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;