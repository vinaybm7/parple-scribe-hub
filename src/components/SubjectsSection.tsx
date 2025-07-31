import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Atom, Code, Zap, Cog, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { containerRef, visibleItems } = useStaggeredScrollAnimation(subjects.length, 120);
  const { elementRef: buttonRef, isVisible: buttonVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 via-purple-50/40 to-pink-50/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef as any}
          className={`text-center mb-16 scroll-slide-left ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Browse by <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Subject</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
            Explore our extensive collection of notes organized by engineering disciplines.
            Find exactly what you need for your studies.
          </p>
        </div>

        <div 
          ref={containerRef as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {subjects.map((subject, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105 hover:-translate-y-1 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-purple-300/50 cursor-pointer rounded-2xl overflow-hidden relative stagger-item ${visibleItems[index] ? 'visible' : ''}`}
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transitionDelay: `${index * 120}ms`
              }}
            >
              {/* Subtle background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${subject.color} shadow-lg border border-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative overflow-hidden`}>
                    {/* Icon shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <subject.icon className="h-6 w-6 text-white drop-shadow-sm relative z-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 drop-shadow-sm group-hover:text-purple-700 transition-colors duration-300">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-700 bg-purple-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-200/50 group-hover:bg-purple-200/80 group-hover:scale-105 transition-all duration-300">
                        {subject.notesCount} notes
                      </span>
                      <div className="flex items-center space-x-1 text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div 
          ref={buttonRef as any}
          className={`text-center scroll-scale-in ${buttonVisible ? 'visible' : ''}`}
        >
          <Link to="/notes">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/20 backdrop-blur-xl border-white/30 hover:bg-white/30 hover:border-white/50 text-gray-800 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl font-medium micro-bounce"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              View All Subjects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;