import { Card, CardHeader, CardDescription } from "./ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <Card className="border border-muted hover:border-primary/20 transition-colors">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 text-primary flex-shrink-0">{icon}</div>
          <h3 className="font-serif text-lg text-primary">{title}</h3>
        </div>
        <CardDescription className="text-secondary text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};