import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TopicSection } from "@/components/TopicSection";
import { SocialProof } from "@/components/SocialProof";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Hero />
      <Features />
      <TopicSection />
      <SocialProof />
      <Footer />
    </div>
  );
};

export default Index;