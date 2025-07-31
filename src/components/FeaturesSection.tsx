import { Card, CardContent } from "@/components/ui/card";
import { Bot, Mic, MessageCircle, BookOpen, Target, BarChart3 } from "lucide-react";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Bot,
    title: "AI Study Companions",
    description: "Meet Luna & Aria - your personal AI companions who make learning engaging and fun"
  },
  {
    icon: Mic,
    title: "Voice-Powered Learning",
    description: "Natural speech interaction with ElevenLabs technology for immersive study sessions"
  },
  {
    icon: MessageCircle,
    title: "24/7 Study Support",
    description: "Get instant help and guidance whenever you need it - your companions never sleep"
  },
  {
    icon: BookOpen,
    title: "Smart Note Organization",
    description: "AI-powered content categorization and intelligent study material recommendations"
  },
  {
    icon: Target,
    title: "Personalized Learning Paths",
    description: "Companion-guided study plans tailored to your learning style and pace"
  },
  {
    icon: BarChart3,
    title: "AI-Powered Analytics",
    description: "Track your progress with intelligent insights and personalized study recommendations"
  }
];

const FeaturesSection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { containerRef, visibleItems } = useStaggeredScrollAnimation(features.length, 150);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50/50 via-pink-50/30 to-blue-50/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef as any}
          className={`text-center mb-16 scroll-fade-in ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            AI-powered learning that{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">adapts to you</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
            Experience the future of education with AI companions who understand your learning style 
            and provide personalized guidance every step of the way.
          </p>
        </div>

        <div 
          ref={containerRef as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-white/20 backdrop-blur-xl border border-white/30 hover:border-purple-300/50 rounded-2xl overflow-hidden relative stagger-item ${visibleItems[index] ? 'visible' : ''}`}
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transitionDelay: visibleItems[index] ? '0ms' : `${index * 150}ms` // Remove delay after animation
              }}
            >
              {/* Subtle hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="p-8 text-center relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <feature.icon className="h-8 w-8 text-purple-600 drop-shadow-sm relative z-10 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 drop-shadow-sm group-hover:text-purple-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;