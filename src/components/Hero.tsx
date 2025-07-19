import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Download } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
            Think{" "}
            <span className="relative">
              <BookOpen className="inline-block h-12 md:h-16 lg:h-20 w-12 md:w-16 lg:w-20 mx-2 text-primary" />
            </span>
            <span className="text-primary font-extrabold">visually,</span>
            <br />
            <span className="relative inline-block">
              {/* Purple gradient background behind "learn deeply" */}
              <span className="absolute inset-0 hero-gradient-accent rounded-3xl transform -skew-y-1 scale-110 z-0"></span>
              <span className="relative z-10 bg-white/90 px-6 py-3 rounded-2xl backdrop-blur-sm border border-border/30 inline-block mx-2">
                learn
              </span>
            </span>{" "}
            <span className="text-foreground font-extrabold">deeply</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Access comprehensive engineering notes, study materials, and resources 
            curated specifically for Indian students. Excel in your academics with 
            our extensive collection.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg" 
              variant="gradient"
              className="text-lg px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-card hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-muted-foreground">Notes Available</div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-card hover:shadow-lg transition-all duration-300">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-muted-foreground">Students Helped</div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-card hover:shadow-lg transition-all duration-300">
              <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-muted-foreground">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;