import { Card } from "./ui/card";

interface StoryCardProps {
  title: string;
  description: string;
  icon: string;
}

export const StoryCard = ({ title, description, icon }: StoryCardProps) => {
  return (
    <Card className="group relative w-full aspect-[9/16] overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/90">
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center text-2xl">
            {icon}
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 px-3 text-center">
          <h3 className="font-serif text-white text-lg mb-1">{title}</h3>
          <p className="text-white/80 text-xs line-clamp-3">{description}</p>
        </div>
      </div>
    </Card>
  );
};