import { Button } from "./ui/button";

const topics = [
  { id: 1, title: "First Vision Accounts", count: 4 },
  { id: 2, title: "Priesthood Restoration", count: 3 },
  { id: 3, title: "Book of Mormon Translation", count: 5 },
  { id: 4, title: "Kirtland Temple Period", count: 6 },
  { id: 5, title: "Succession Crisis", count: 4 },
  { id: 6, title: "Nauvoo Period", count: 7 },
  { id: 7, title: "Plural Marriage", count: 5 },
  { id: 8, title: "Western Migration", count: 4 },
  { id: 9, title: "Early Revelations", count: 3 },
  { id: 10, title: "Church Organization", count: 5 },
  { id: 11, title: "Missouri Conflicts", count: 6 },
  { id: 12, title: "Doctrinal Development", count: 8 },
];

const categories = [
  "All Topics",
  "Early Church",
  "Authority",
  "Scripture",
  "Temples",
  "Leadership",
  "Community",
  "Doctrine",
  "History",
];

export const TopicSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-4xl text-primary mb-4">
            Explore Historical Topics
          </h2>
          <p className="text-secondary text-lg">
            If you're looking to dive deep, our content is organized into various topics
            covering key events, figures, and developments in Mormon history.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All Topics" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-2 max-w-4xl mx-auto">
          {topics.map((topic) => (
            <button
              key={topic.id}
              className="w-full p-4 text-left bg-accent/50 hover:bg-accent transition-colors rounded-lg flex justify-between items-center group"
            >
              <div>
                <h3 className="font-serif text-lg text-primary group-hover:text-primary/80 transition-colors">
                  {topic.title}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {topic.count} sources
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-background/50 flex items-center justify-center">
                <span className="text-primary text-sm">{topic.count}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};