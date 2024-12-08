import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserList } from "@/components/users/UserList";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();

  // Check authentication and admin status
  useAuthCheck();

  // Fetch users data
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{ users: any[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) {
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

  return (
    <div className="flex h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">User Management</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/admin/users/invite">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        {showSearch && (
          <div className="border-t p-4 bg-background">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <UserList
          users={users || []}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default UserManagement;