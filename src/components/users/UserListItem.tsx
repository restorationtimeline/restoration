import { ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";

type UserListItemProps = {
  id: string;
  email?: string;
  displayName: string | null;
  role: string | null;
  fullName?: string | null;
  profilePhotoUrl?: string | null;
};

export function UserListItem({ 
  id, 
  email, 
  displayName, 
  role, 
  fullName,
  profilePhotoUrl 
}: UserListItemProps) {
  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <Star className="h-4 w-4 text-red-500" />;
      case 'editor':
        return <Star className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Link to={`/admin/users/${id}`} className="block">
      <Button
        variant="ghost"
        className="w-full justify-between hover:bg-accent"
      >
        <div className="flex items-center gap-3">
          <UserAvatar photoUrl={profilePhotoUrl} />
          <div className="text-left flex items-center gap-2">
            <p className="font-medium">{fullName || displayName || email || "Unnamed User"}</p>
            {getRoleIcon()}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>
    </Link>
  );
}