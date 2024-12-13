import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TopicSection } from "@/components/TopicSection";
import { SocialProof } from "@/components/SocialProof";
import { MainLayout } from "@/components/layouts/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <TopicSection />
      <SocialProof />
    </MainLayout>
  );
};

export default Index;