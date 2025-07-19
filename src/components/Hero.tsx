import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Download } from "lucide-react";
import FloatingHeader from "./FloatingHeader";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient-bg">
      <FloatingHeader />
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight text-foreground">
            From{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent font-extrabold">
              Scattered
            </span>{" "}
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

          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your engineering study chaos into organized, searchable knowledge 
            that actually helps you succeed.
          </p>

          {/* CTA Button */}
          <div className="pt-12">
            <Button 
              size="lg" 
              variant="gradient"
              className="text-xl px-12 py-8 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-primary/50 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-semibold"
            >
              Organize My Notes
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;