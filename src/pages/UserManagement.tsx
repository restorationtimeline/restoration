import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Search } from "lucide-react";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";
import { UserListItem } from "@/components/users/UserListItem";
import { UserDetails } from "@/components/users/UserDetails";
import { useToast } from "@/components/ui/use-toast";

type UserWithProfile = {
  id: string;
  email?: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    role: string | null;
  };
};

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth");
        throw new Error("Not authenticated");
      }

      // Verify admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        throw new Error("Not authorized");
      }

      // Call the admin function with the session token
      const { data, error } = await supabase.functions.invoke<{ users: UserWithProfile[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) {
        console.error('Admin function error:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data.users;
    },
    retry: false,
  });

  const filteredUsers = users?.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">User Management</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 pt-16">
        {/* User List */}
        <div className="flex w-full flex-col border-r md:w-80">
          <div className="border-b p-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <InviteUserDialog />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {isLoading ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Loading users...
                </p>
              ) : filteredUsers?.map((user) => (
                <UserListItem
                  key={user.id}
                  email={user.email}
                  displayName={user.profile?.display_name}
                  role={user.profile?.role}
                  onClick={() => setSelectedUser(user)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Details */}
        <div className="hidden flex-1 md:block">
          {selectedUser ? (
            <UserDetails user={selectedUser} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;