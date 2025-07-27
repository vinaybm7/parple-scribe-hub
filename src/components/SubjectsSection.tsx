import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Atom, Code, Zap, Cog, Cpu } from "lucide-react";

const subjects = [
  {
    icon: Calculator,
    name: "Engineering Mathematics",
    description: "Calculus, Linear Algebra, Differential Equations",
    notesCount: 85,
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Atom,
    name: "Engineering Physics",
    description: "Mechanics, Thermodynamics, Wave Optics",
    notesCount: 72,
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: Code,
    name: "Programming Fundamentals",
    description: "C Programming, Data Structures, Algorithms",
    notesCount: 94,
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: Zap,
    name: "Basic Electrical Engineering",
    description: "Circuit Analysis, Network Theory, AC/DC Circuits",
    notesCount: 68,
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Cog,
    name: "Engineering Mechanics",
    description: "Statics, Dynamics, Strength of Materials",
    notesCount: 76,
    color: "from-gray-500 to-slate-600"
  },
  {
    icon: Cpu,
    name: "Digital Electronics",
    description: "Logic Gates, Boolean Algebra, Sequential Circuits",
    notesCount: 58,
    color: "from-green-500 to-teal-500"
  }
];

const SubjectsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by <span className="text-gradient">Subject</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our extensive collection of notes organized by engineering disciplines.
            Find exactly what you need for your studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((subject, index) => (
            <Card 
              key={index}
              className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${subject.color} shadow-lg`}>
                    <subject.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {subject.notesCount} notes
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
            View All Subjects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;