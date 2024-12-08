import { ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type UserListItemProps = {
  id: string;
  email?: string;
  displayName: string | null;
  role: string | null;
};

export function UserListItem({ id, email, displayName, role }: UserListItemProps) {
  return (
    <Link to={`/admin/users/${id}`} className="block">
      <Button
        variant="ghost"
        className="w-full justify-between hover:bg-accent"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">{displayName || email || "Unnamed User"}</p>
            <p className="text-sm text-muted-foreground">{role || "No role"}</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>
    </Link>
  );
}