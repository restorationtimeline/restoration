import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ContentNavButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const ContentNavButton = ({ title, description, icon: Icon, href }: ContentNavButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
      onClick={() => window.location.href = href}
    >
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-base font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          {description}
        </span>
      </div>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};