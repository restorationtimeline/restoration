import { ScrollArea } from "@/components/ui/scroll-area";
import { UserListItem } from "./UserListItem";

interface UserListProps {
  users: Array<{
    id: string;
    email?: string;
    profile?: {
      display_name: string | null;
      role: string | null;
    };
  }>;
  isLoading: boolean;
  searchQuery: string;
}

export function UserList({ users, isLoading, searchQuery }: UserListProps) {
  const filteredUsers = users?.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-1 p-2">
        {isLoading ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Loading users...
          </p>
        ) : filteredUsers?.map((user) => (
          <UserListItem
            key={user.id}
            id={user.id}
            email={user.email}
            displayName={user.profile?.display_name}
            role={user.profile?.role}
          />
        ))}
      </div>
    </ScrollArea>
  );
}