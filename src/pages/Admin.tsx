import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

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
        navigate('/');
      }
      
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <nav className="divide-y">
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
            onClick={() => navigate("/admin/users")}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-medium">User Management</span>
              <span className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
            onClick={() => navigate("/admin/content")}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-medium">Content Management</span>
              <span className="text-sm text-muted-foreground">
                Manage timeline content and entries
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
            onClick={() => navigate("/admin/analytics")}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-medium">Analytics</span>
              <span className="text-sm text-muted-foreground">
                View site statistics and user engagement
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
            onClick={() => navigate("/admin/settings")}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-medium">Settings</span>
              <span className="text-sm text-muted-foreground">
                Configure site settings and preferences
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </nav>
      </main>
    </div>
  );
};

export default Admin;