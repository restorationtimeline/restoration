import { Section } from "./ui/section";
import { StoryCard } from "./StoryCard";

export const TopicSection = () => {
  const topics = [
    {
      title: "First Vision",
      description: "Explore various accounts and interpretations of Joseph Smith's theophany",
      icon: "🌟"
    },
    {
      title: "Book of Mormon",
      description: "Examine the origins, translation process, and early reactions",
      icon: "📖"
    },
    {
      title: "Priesthood Restoration",
      description: "Trace the development of priesthood authority claims",
      icon: "🔑"
    },
    {
      title: "Church Organization",
      description: "Study the evolution of ecclesiastical structure and leadership",
      icon: "⛪"
    }
  ];

  return (
    <Section className="bg-muted">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-serif text-primary mb-4">
          Key Topics
        </h2>
        <p className="text-secondary text-lg">
          Dive deep into pivotal moments and themes in Mormon history
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <StoryCard
            key={index}
            title={topic.title}
            description={topic.description}
            icon={topic.icon}
          />
        ))}
      </div>
    </Section>
  );
};