import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserList } from "@/components/users/UserList";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";
import { ChevronLeft, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
          <div className="ml-auto">
            <Link to="/admin/users/invite">
              <Button size="icon" variant="ghost">
                <UserPlus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="border-t p-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </header>

      <main className="flex-1 pt-32">
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