import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
    <div className="flex h-screen flex-col">
      {/* Fixed Navbar */}
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

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4 pt-20">
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="justify-start text-left h-auto py-4"
            onClick={() => navigate("/admin/users")}
          >
            <div>
              <div className="font-medium">User Management</div>
              <div className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start text-left h-auto py-4"
          >
            <div>
              <div className="font-medium">Content Management</div>
              <div className="text-sm text-muted-foreground">
                Manage timeline content and entries
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start text-left h-auto py-4"
          >
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-muted-foreground">
                View site statistics and user engagement
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start text-left h-auto py-4"
          >
            <div>
              <div className="font-medium">Settings</div>
              <div className="text-sm text-muted-foreground">
                Configure site settings and preferences
              </div>
            </div>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Admin;