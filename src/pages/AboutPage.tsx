import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Users, Target, Heart, Award, Zap, Bot, Mic, MessageCircle } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80">
      <Header />
      
      {/* Mission Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 drop-shadow-sm">
              About <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Parple Notes</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto drop-shadow-sm">
              Revolutionizing engineering education with AI-powered companions and personalized learning experiences
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 drop-shadow-sm">
              Our <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed drop-shadow-sm">
              We're pioneering the future of engineering education through AI-powered learning companions. 
              Our mission is to make complex engineering concepts accessible and engaging by providing 
              personalized, interactive study experiences that adapt to each student's unique learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl glass-morphism">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  <Bot className="h-8 w-8 text-purple-600 drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 drop-shadow-sm">AI-Powered Learning</h3>
                <p className="text-gray-700">
                  Advanced AI companions that understand your learning style and provide personalized guidance for better outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl glass-morphism">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  <Users className="h-8 w-8 text-purple-600 drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 drop-shadow-sm">Student-Centric Design</h3>
                <p className="text-gray-700">
                  Built by students, for students. Our AI companions are designed to understand and address real learning challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl glass-morphism">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  <Heart className="h-8 w-8 text-purple-600 drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 drop-shadow-sm">Accessible Innovation</h3>
                <p className="text-gray-700">
                  Cutting-edge AI technology made accessible to every student, democratizing personalized education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Companions Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50/30 via-purple-50/40 to-pink-50/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
              Meet Your <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AI Companions</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
              Luna and Aria are your personal AI study companions, each with unique personalities 
              designed to make learning engaging and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl glass-morphism">
              <CardContent className="p-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-1 mb-6 shadow-2xl relative overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="/images/avatars/luna-avatar.png"
                      alt="Luna avatar"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full rounded-full bg-white/90 items-center justify-center hidden">
                      <Bot className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 drop-shadow-sm">Luna</h3>
                <p className="text-gray-700 mb-4">
                  Your energetic and playful study buddy who makes learning fun and exciting. 
                  Luna specializes in breaking down complex concepts into digestible, engaging lessons.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Mic className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Voice-powered interactions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/25 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl glass-morphism">
              <CardContent className="p-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 p-1 mb-6 shadow-2xl relative overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="/images/avatars/aria-avatar.png"
                      alt="Aria avatar"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full rounded-full bg-white/90 items-center justify-center hidden">
                      <Bot className="w-12 h-12 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 drop-shadow-sm">Aria</h3>
                <p className="text-gray-700 mb-4">
                  Your calm and wise companion who brings peace and wisdom to your studies. 
                  Aria focuses on deep understanding and thoughtful learning approaches.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-gray-600">Thoughtful guidance</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
              Our <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-lg text-gray-700 drop-shadow-sm">
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
      <section className="py-16 bg-gradient-to-b from-pink-50/30 via-purple-50/40 to-blue-50/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center drop-shadow-sm">
              Our <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Story</span>
            </h2>
            
            <div className="prose prose-lg mx-auto text-gray-700">
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