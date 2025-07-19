import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import SubjectsSection from "@/components/SubjectsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturesSection />
      <SubjectsSection />
      <Footer />
    </div>
  );
};

export default Index;
