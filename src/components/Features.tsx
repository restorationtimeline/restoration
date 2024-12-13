import { Section } from "./ui/section";
import { StoryCard } from "./StoryCard";

export const Features = () => {
  const features = [
    {
      title: "Multiple Perspectives",
      description: "Explore diverse viewpoints on historical events and interpretations",
      icon: "🔍"
    },
    {
      title: "Interactive Timeline",
      description: "Navigate through history with our dynamic timeline interface",
      icon: "📅"
    },
    {
      title: "Source Analysis",
      description: "Examine primary sources and scholarly interpretations",
      icon: "📚"
    },
    {
      title: "Community Insights",
      description: "Engage with other researchers and share discoveries",
      icon: "👥"
    }
  ];

  return (
    <Section className="bg-background">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-serif text-primary mb-4">
          Discover the Story
        </h2>
        <p className="text-secondary text-lg">
          Explore the rich tapestry of Mormon history through multiple lenses and perspectives
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <StoryCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </Section>
  );
};