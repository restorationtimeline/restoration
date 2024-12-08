import { ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserListItemProps = {
  email?: string;
  displayName: string | null;
  role: string | null;
  onClick: () => void;
};

export function UserListItem({ email, displayName, role, onClick }: UserListItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-between hover:bg-accent"
      onClick={onClick}
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
  );
}