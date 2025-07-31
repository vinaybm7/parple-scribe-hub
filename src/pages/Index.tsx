import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import SubjectsSection from "@/components/SubjectsSection";
import Footer from "@/components/Footer";
import FloatingHeader from "@/components/FloatingHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <Hero />
      <FeaturesSection />
      <SubjectsSection />
      <Footer />
    </div>
  );
};

export default Index;
