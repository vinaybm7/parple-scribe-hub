import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import SubjectsSection from "@/components/SubjectsSection";
import Footer from "@/components/Footer";
import GradientSection from "@/components/GradientSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <GradientSection />
      <FeaturesSection />
      <SubjectsSection />
      <Footer />
    </div>
  );
};

export default Index;
