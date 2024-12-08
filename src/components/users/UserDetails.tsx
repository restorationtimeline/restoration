import { UserRoleSelect } from "./UserRoleSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type UserDetailsProps = {
  user: {
    id: string;
    email?: string;
    created_at: string;
    profile?: {
      display_name: string | null;
      role: string | null;
    };
  };
};

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] px-6">
      <div className="space-y-6 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {user.profile?.display_name || user.email || "Unnamed User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            User details and management
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Role</h3>
            <UserRoleSelect userId={user.id} currentRole={user.profile?.role} />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Joined</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}