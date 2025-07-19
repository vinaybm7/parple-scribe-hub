import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Users, Target, Heart, Award, Zap } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-background to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About Parple Notes
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empowering engineering students across India with quality study materials and resources
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that quality education should be accessible to everyone. Parple Notes was created 
              to bridge the gap between complex engineering concepts and student understanding by providing 
              comprehensive, well-structured study materials that make learning engaging and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quality First</h3>
                <p className="text-muted-foreground">
                  Every note is carefully reviewed and verified by subject matter experts to ensure accuracy and completeness.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Student-Centric</h3>
                <p className="text-muted-foreground">
                  Designed by students, for students. We understand the challenges and create content that truly helps.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Free Access</h3>
                <p className="text-muted-foreground">
                  We believe education should be free. All our resources are available to students without any cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Numbers that showcase our commitment to student success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Notes Available</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10,000+</div>
              <div className="text-muted-foreground">Students Helped</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">50,000+</div>
              <div className="text-muted-foreground">Downloads</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">20+</div>
              <div className="text-muted-foreground">Universities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our <span className="text-gradient">Story</span>
            </h2>
            
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-6">
                Parple Notes was born from a simple observation: engineering students across India were struggling 
                to find quality study materials that were both comprehensive and easy to understand. As engineering 
                students ourselves, we experienced firsthand the challenges of navigating complex concepts with 
                limited resources.
              </p>
              
              <p className="mb-6">
                What started as a small initiative to share notes among friends quickly grew into something much 
                larger. We realized that there was a massive need for centralized, high-quality educational 
                resources that could help students not just pass their exams, but truly understand the subjects 
                they were studying.
              </p>
              
              <p className="mb-6">
                Today, Parple Notes serves thousands of engineering students across India, providing them with 
                carefully curated study materials, comprehensive notes, and practical examples that make learning 
                engineering subjects more accessible and enjoyable.
              </p>
              
              <p>
                Our commitment remains unchanged: to democratize quality engineering education and help every 
                student reach their full potential, regardless of their background or circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;