import { FeatureCard } from "./FeatureCard";

export const Features = () => {
  const features = [
    {
      title: "People",
      description: "Learn about key figures who shaped the Restoration movement and their lasting impact.",
      icon: "👥",
    },
    {
      title: "Events",
      description: "Explore significant moments and turning points in Mormon history.",
      icon: "📅",
    },
    {
      title: "Places",
      description: "Discover the locations where important historical events unfolded.",
      icon: "🏛️",
    },
    {
      title: "Organizations",
      description: "Understand the various groups and institutions that emerged during the Restoration.",
      icon: "🏢",
    },
    {
      title: "Ideas",
      description: "Examine the theological concepts and doctrinal developments that shaped the movement.",
      icon: "💡",
    },
    {
      title: "Artifacts",
      description: "Study historical objects and documents that provide insights into the past.",
      icon: "📜",
    },
    {
      title: "Sources",
      description: "Access primary and secondary sources that document the historical record.",
      icon: "📚",
    },
    {
      title: "Perspectives",
      description: "Consider different viewpoints and interpretations of historical events.",
      icon: "🔍",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-4xl md:text-5xl text-primary text-center mb-12">
          What Will You Learn?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};