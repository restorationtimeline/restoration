import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <Card className="border-2 border-muted hover:border-primary/20 transition-colors">
      <CardHeader>
        <div className="w-12 h-12 mb-4 text-primary">{icon}</div>
        <CardTitle className="font-serif text-2xl text-primary">{title}</CardTitle>
        <CardDescription className="text-secondary">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};