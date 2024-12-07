import { FeatureCard } from "./FeatureCard";

export const Features = () => {
  const features = [
    {
      title: "Ancient Civilizations",
      description: "Explore the foundations of human society through ancient civilizations.",
      icon: "🏛️",
    },
    {
      title: "Medieval Period",
      description: "Discover the rich history of castles, knights, and medieval culture.",
      icon: "⚔️",
    },
    {
      title: "Renaissance",
      description: "Experience the rebirth of art, science, and human achievement.",
      icon: "🎨",
    },
    {
      title: "Modern Era",
      description: "Understand the events that shaped our contemporary world.",
      icon: "🌍",
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