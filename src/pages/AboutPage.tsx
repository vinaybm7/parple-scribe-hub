import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Users, Target, Heart, Award, Zap, Bot, Mic, MessageCircle } from "lucide-react";

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
            Revolutionizing engineering education with AI-powered companions and personalized learning experiences
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
              We're pioneering the future of engineering education through AI-powered learning companions. 
              Our mission is to make complex engineering concepts accessible and engaging by providing 
              personalized, interactive study experiences that adapt to each student's unique learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">AI-Powered Learning</h3>
                <p className="text-muted-foreground">
                  Advanced AI companions that understand your learning style and provide personalized guidance for better outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Student-Centric Design</h3>
                <p className="text-muted-foreground">
                  Built by students, for students. Our AI companions are designed to understand and address real learning challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl card-gradient">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Accessible Innovation</h3>
                <p className="text-muted-foreground">
                  Cutting-edge AI technology made accessible to every student, democratizing personalized education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Companions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Your <span className="text-gradient">AI Companions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Luna and Aria are your personal AI study companions, each with unique personalities 
              designed to make learning engaging and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Luna</h3>
                <p className="text-muted-foreground mb-4">
                  Your energetic and playful study buddy who makes learning fun and exciting. 
                  Luna specializes in breaking down complex concepts into digestible, engaging lessons.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Mic className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Voice-powered interactions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Aria</h3>
                <p className="text-muted-foreground mb-4">
                  Your calm and wise companion who brings peace and wisdom to your studies. 
                  Aria focuses on deep understanding and thoughtful learning approaches.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">Thoughtful guidance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Transforming engineering education with AI-powered learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">2</div>
              <div className="text-muted-foreground">AI Companions</div>
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
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Smart Notes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our <span className="text-gradient">Story</span>
            </h2>
            
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-6">
                Parple Notes began with a simple observation: engineering students across India were struggling 
                to find personalized, engaging study experiences. As engineering students ourselves, we knew that 
                traditional learning methods weren't enough to tackle the complexity of modern engineering education.
              </p>
              
              <p className="mb-6">
                What started as a platform for sharing notes evolved into something revolutionary when we introduced 
                AI companions. We realized that students needed more than just static content - they needed interactive, 
                personalized learning partners who could adapt to their unique learning styles and provide guidance 
                whenever needed.
              </p>
              
              <p className="mb-6">
                The breakthrough came with Luna and Aria - our AI companions powered by advanced language models and 
                voice technology. These aren't just chatbots; they're sophisticated learning partners designed to 
                understand, encourage, and guide students through their engineering journey with empathy and intelligence.
              </p>
              
              <p>
                Today, Parple Notes represents the future of engineering education - where AI-powered personalization 
                meets human-centered design to create learning experiences that are not just effective, but truly 
                transformative. Our mission continues: to democratize personalized education and help every student 
                unlock their full potential through the power of AI.
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