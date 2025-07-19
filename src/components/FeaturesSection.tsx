import { Card, CardContent } from "@/components/ui/card";
import { Brain, Download, Search, Users, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Comprehensive Notes",
    description: "Detailed notes covering all engineering subjects with diagrams and examples"
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "Download PDF notes instantly with just one click, no registration required"
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you need with our intelligent search and filtering system"
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Connect with fellow engineering students and share knowledge"
  },
  {
    icon: Zap,
    title: "Regular Updates",
    description: "Fresh content added regularly to keep up with latest curriculum"
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "All notes are verified and reviewed by subject matter experts"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to{" "}
            <span className="text-gradient">excel in engineering</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From basic concepts to advanced topics, we've got you covered with 
            comprehensive study materials and resources.
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