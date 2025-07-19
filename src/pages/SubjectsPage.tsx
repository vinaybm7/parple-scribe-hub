import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Cpu, Zap, Cog, Calculator, Atom, ArrowRight, BookOpen } from "lucide-react";

const subjects = [
  {
    id: "computer-science",
    icon: Code,
    name: "Computer Science",
    description: "Programming languages, data structures, algorithms, database management, software engineering, and computer networks.",
    topics: ["Programming in C/C++", "Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks"],
    notesCount: 120,
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50"
  },
  {
    id: "electrical",
    icon: Zap,
    name: "Electrical Engineering",
    description: "Circuit analysis, power systems, electronics, electromagnetic fields, control systems, and electrical machines.",
    topics: ["Circuit Analysis", "Power Systems", "Electronics", "Control Systems", "Electrical Machines", "EMF Theory"],
    notesCount: 95,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50"
  },
  {
    id: "mechanical",
    icon: Cog,
    name: "Mechanical Engineering",
    description: "Thermodynamics, mechanics, manufacturing processes, machine design, fluid mechanics, and heat transfer.",
    topics: ["Thermodynamics", "Mechanics", "Manufacturing", "Machine Design", "Fluid Mechanics", "Heat Transfer"],
    notesCount: 88,
    color: "from-gray-500 to-slate-600",
    bgColor: "bg-gray-50"
  },
  {
    id: "electronics",
    icon: Cpu,
    name: "Electronics & Communication",
    description: "Digital electronics, analog circuits, communication systems, signal processing, and microprocessors.",
    topics: ["Digital Electronics", "Analog Circuits", "Communication Systems", "Signal Processing", "Microprocessors", "VLSI Design"],
    notesCount: 76,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50"
  },
  {
    id: "mathematics",
    icon: Calculator,
    name: "Mathematics",
    description: "Calculus, linear algebra, differential equations, probability, statistics, and numerical methods.",
    topics: ["Calculus", "Linear Algebra", "Differential Equations", "Probability", "Statistics", "Numerical Methods"],
    notesCount: 64,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50"
  },
  {
    id: "physics",
    icon: Atom,
    name: "Physics",
    description: "Classical mechanics, quantum mechanics, thermodynamics, electromagnetism, and modern physics.",
    topics: ["Classical Mechanics", "Quantum Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
    notesCount: 52,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50"
  }
];

const SubjectsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-background to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Engineering Subjects
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our comprehensive collection organized by engineering disciplines
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${subject.color} shadow-lg shrink-0`}>
                      <subject.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {subject.name}
                        </h3>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {subject.notesCount} notes
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {subject.description}
                      </p>
                      
                      {/* Topics */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {subject.topics.map((topic, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Button 
                        variant="outline" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse Notes
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubjectsPage;