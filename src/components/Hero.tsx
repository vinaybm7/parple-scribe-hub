import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Download } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Main Headline */}
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Think{" "}
            <span className="relative">
              <BookOpen className="inline-block h-12 md:h-16 lg:h-20 w-12 md:w-16 lg:w-20 mx-2 text-white/90" />
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/30 inline-block mx-2">
              visually,
            </span>
            <br />
            learn{" "}
            <span className="text-white/90 font-extrabold">deeply</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Access comprehensive engineering notes, study materials, and resources 
            curated specifically for Indian students. Excel in your academics with 
            our extensive collection.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg" 
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm text-lg px-8 py-6 rounded-2xl shadow-glow transition-all duration-300 hover:scale-105"
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-white/90" />
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/70">Notes Available</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-white/90" />
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-white/70">Students Helped</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-white/90" />
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/70">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;