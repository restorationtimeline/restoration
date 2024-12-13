import { Section } from "./ui/section";

export const SocialProof = () => {
  return (
    <Section className="bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-serif text-primary mb-4">
          Join the Community
        </h2>
        <p className="text-secondary text-lg mb-8">
          Connect with scholars, researchers, and history enthusiasts exploring Mormon history together
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-accent rounded-lg">
            <div className="text-3xl mb-2">1000+</div>
            <div className="text-secondary">Active Users</div>
          </div>
          <div className="p-6 bg-accent rounded-lg">
            <div className="text-3xl mb-2">500+</div>
            <div className="text-secondary">Historical Sources</div>
          </div>
          <div className="p-6 bg-accent rounded-lg">
            <div className="text-3xl mb-2">50+</div>
            <div className="text-secondary">Expert Contributors</div>
          </div>
        </div>
      </div>
    </Section>
  );
};