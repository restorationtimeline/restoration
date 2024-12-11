import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminListItemProps {
  title: string;
  description: string;
  to: string;
  icon?: React.ReactNode;
}

export const AdminListItem = ({ title, description, to, icon }: AdminListItemProps) => {
  return (
    <Button
      variant="ghost"
      asChild
      className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
    >
      <Link to={to}>
        <div className="flex items-center gap-4">
          {icon}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-base font-medium">{title}</span>
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </Button>
  );
};