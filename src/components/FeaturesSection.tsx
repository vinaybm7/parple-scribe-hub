import { Card, CardContent } from "@/components/ui/card";
import { Bot, Mic, MessageCircle, BookOpen, Target, BarChart3 } from "lucide-react";

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
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-powered learning that{" "}
            <span className="text-gradient">adapts to you</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of education with AI companions who understand your learning style 
            and provide personalized guidance every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient group-hover:shadow-primary transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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