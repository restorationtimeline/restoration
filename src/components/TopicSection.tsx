import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const topics = [
  { id: 1, title: "First Vision Accounts", category: "Early Church", count: 4 },
  { id: 2, title: "Priesthood Restoration", category: "Authority", count: 3 },
  { id: 3, title: "Book of Mormon Translation", category: "Scripture", count: 5 },
  { id: 4, title: "Kirtland Temple Period", category: "Temples", count: 6 },
  { id: 5, title: "Succession Crisis", category: "Leadership", count: 4 },
  { id: 6, title: "Nauvoo Period", category: "Community", count: 7 },
  { id: 7, title: "Plural Marriage", category: "Doctrine", count: 5 },
  { id: 8, title: "Western Migration", category: "History", count: 4 },
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
        <h2 className="font-serif text-4xl text-primary mb-8">Explore by Topic</h2>
        
        <div className="flex flex-wrap gap-2 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="hover:border-primary/20 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-serif text-lg text-primary mb-1">{topic.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{topic.category}</span>
                  <span className="text-sm text-muted-foreground">{topic.count} sources</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};