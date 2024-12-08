import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserDetails } from "@/components/users/UserDetails";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        throw new Error("Not authenticated");
      }

      const { data: users, error } = await supabase.functions.invoke<{ users: any[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
        throw error;
      }

      const user = users.users.find(u => u.id === userId);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        throw new Error("User not found");
      }

      return user;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/users">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">User Details</h1>
        </div>
      </header>

      <main className="pt-16">
        {user && <UserDetails user={user} />}
      </main>
    </div>
  );
};

export default UserDetailsPage;