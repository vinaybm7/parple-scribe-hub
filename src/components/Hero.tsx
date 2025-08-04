import { CTAGlow } from "@/components/ui/cta-glow";
import { DreamWaveBackground } from "@/components/ui/dream-wave-background";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <DreamWaveBackground className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Enhanced Glassmorphism Frame Container */}
      <div className="relative z-40 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen pt-24">
        <div className="relative max-w-6xl mx-auto">
          {/* Premium Multi-layered Glassmorphism Frame with Luxury Animations */}
          <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/15 via-purple-100/10 to-pink-100/10 border border-white/25 rounded-[2.5rem] shadow-2xl transform rotate-1 scale-[1.02] animate-fade-in-up" 
            style={{
              boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              animationDelay: '0.1s',
              animationFillMode: 'both'
            }}></div>
          <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/30 via-purple-200/15 to-pink-200/15 border border-white/35 rounded-[2.5rem] shadow-xl transform -rotate-0.5 animate-fade-in-up"
            style={{
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              animationDelay: '0.15s',
              animationFillMode: 'both'
            }}></div>
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-t from-white/25 via-transparent to-white/20 border border-white/45 rounded-[2.5rem] shadow-lg animate-fade-in-up"
            style={{
              boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}></div>
          
          {/* Premium Inner Content Frame with Luxury Glassmorphism */}
          <div className="relative z-10 backdrop-blur-md bg-gradient-to-br from-white/12 via-white/8 to-white/6 border border-white/30 rounded-[2rem] mx-2 sm:mx-4 animate-fade-in-up overflow-hidden"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 12px 24px -6px rgba(0, 0, 0, 0.15)',
              animationDelay: '0.25s',
              animationFillMode: 'both'
            }}>
            {/* Premium Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
            {/* Content Container */}
            <div className="px-8 sm:px-12 lg:px-16 py-20 sm:py-24 lg:py-28 text-center">
            {/* Main Headline with Animation */}
            <div className="space-y-10 sm:space-y-12 lg:space-y-14">
              <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  From{" "}
                </span>
                <span className="relative inline-block animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-500/40 blur-lg rounded-lg animate-pulse"></span>
                  <span className="relative bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent font-extrabold" 
                    style={{
                      textShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.6)',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}>
                    Scattered
                  </span>
                </span>{" "}
                <span className="text-white font-extrabold inline-block animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  Notes,
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                  to{" "}
                </span>
                <span className="relative inline-block group animate-fade-in-up" style={{ animationDelay: '1.0s', animationFillMode: 'both' }}>
                  {/* Beautiful animated wavy underline effect */}
                  <span className="relative z-10 text-white font-extrabold px-2 transition-all duration-500 group-hover:scale-105">
                    <span className="relative wavy-underline-text">
                      Systematic
                    </span>
                  </span>
                </span>{" "}
                <span className="text-white font-extrabold inline-block animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
                  Success
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg animate-fade-in-up" 
                style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>
                Transform your engineering study chaos into organized, searchable knowledge 
                that actually helps you succeed.
              </p>

              {/* Premium CTA Button with Stunning Hover Effects */}
              <div className="flex justify-center mt-12 sm:mt-14 lg:mt-16 animate-fade-in-up" 
                style={{ animationDelay: '1.6s', animationFillMode: 'both' }}>
                <div className="relative inline-block group">
                  {/* Enhanced Multi-layered Background Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-3xl blur-3xl scale-110 animate-pulse group-hover:scale-125 group-hover:blur-[40px] transition-all duration-500" 
                    style={{ animationDelay: '1.8s' }}></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-3xl blur-2xl scale-105 animate-fade-in-up group-hover:scale-115 group-hover:opacity-80 transition-all duration-500" 
                    style={{ animationDelay: '1.7s', animationFillMode: 'both' }}></div>
                  
                  {/* Rotating Border Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-spin-slow opacity-20"></div>
                  </div>
                  
                  <Link to="/notes">
                    <button className="relative z-10 font-bricolage font-bold text-white text-lg sm:text-xl px-10 sm:px-12 lg:px-14 py-4 sm:py-5 lg:py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-2xl border border-white/20 backdrop-blur-sm transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center gap-3 group min-w-[280px] sm:min-w-[320px] animate-fade-in-up overflow-hidden" 
                      style={{ animationDelay: '1.6s', animationFillMode: 'both' }}>
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                      
                      {/* Removed particle dots effect */}
                      
                      {/* Enhanced Text with Glow */}
                      <span className="relative z-10 animate-fade-in-up group-hover:text-shadow-glow transition-all duration-300" 
                        style={{ 
                          animationDelay: '1.8s', 
                          animationFillMode: 'both',
                          textShadow: '0 0 0 transparent'
                        }}>
                        Organize Your Studies Now
                      </span>
                      
                      {/* Enhanced Arrow with Multiple Effects */}
                      <div className="relative">
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500 animate-fade-in-up relative z-10" 
                          style={{ animationDelay: '2.0s', animationFillMode: 'both' }} />
                        {/* Arrow Glow Trail */}
                        <ArrowRight className="absolute top-0 left-0 h-5 w-5 text-white/50 blur-sm group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-hover:scale-100 group-hover:opacity-0 transition-all duration-500 opacity-100"></div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </DreamWaveBackground>
  );
};

export default Hero;