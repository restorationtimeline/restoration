import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

interface UserManagementHeaderProps {
  onInviteClick: () => void;
}

export function UserManagementHeader({ onInviteClick }: UserManagementHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Users</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onInviteClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}