import { CTAGlow } from "@/components/ui/cta-glow";
import { ArrowRight } from "lucide-react";
import FloatingHeader from "./FloatingHeader";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Rising sun gradient background */}
      <div className="absolute inset-0 gradient-rising-sun opacity-60"></div>
      <FloatingHeader />
      <div className="relative z-10 container mx-auto px-4 text-center pt-32 pb-16">
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
            <CTAGlow 
              size="xl"
              className="font-bricolage font-bold"
            >
              Organize Your Studies Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </CTAGlow>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;