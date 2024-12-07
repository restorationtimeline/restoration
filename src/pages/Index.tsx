import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TopicSection } from "@/components/TopicSection";
import { SocialProof } from "@/components/SocialProof";

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Hero />
      <Features />
      <TopicSection />
      <SocialProof />
    </div>
  );
};

export default Index;