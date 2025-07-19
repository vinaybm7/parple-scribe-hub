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
            Learn{" "}
            <span className="relative twinkling-stars">
              <Star className="inline-block h-14 md:h-20 lg:h-24 w-14 md:w-20 lg:w-24 mx-2 text-primary" />
            </span>
            <span className="text-primary font-extrabold">effortlessly,</span>
            <br />
            <span className="relative inline-block group">
              {/* Purple gradient background behind "excel" */}
              <span className="absolute inset-0 hero-gradient-accent rounded-3xl transform -skew-y-1 scale-110 z-0 opacity-30"></span>
              <span className="relative z-10 bg-white px-8 py-4 rounded-3xl shadow-lg border border-border/20 inline-block mx-2 transform -rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105 cursor-pointer">
                <span className="text-foreground font-bold">excel</span>
              </span>
            </span>{" "}
            <span className="text-foreground font-extrabold">everywhere</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master engineering concepts with comprehensive notes, detailed explanations, 
            and curated study materials designed for Indian engineering students. 
            Your path to academic excellence starts here.
          </p>

          {/* CTA Button */}
          <div className="pt-12">
            <Button 
              size="lg" 
              variant="gradient"
              className="text-lg px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;