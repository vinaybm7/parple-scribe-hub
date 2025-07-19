import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Download } from "lucide-react";
import FloatingHeader from "./FloatingHeader";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <FloatingHeader />
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-foreground">
            From{" "}
            <span className="relative twinkling-stars">
              <Star className="inline-block h-10 md:h-14 lg:h-16 w-10 md:w-14 lg:w-16 mx-2 text-primary" />
            </span>
            <span className="text-primary font-extrabold">Scattered Notes,</span>
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

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your engineering study chaos into organized, searchable knowledge 
            that actually helps you succeed.
          </p>

          {/* CTA Button */}
          <div className="pt-12">
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
    </section>
  );
};

export default Hero;