import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminListItem } from "@/components/admin/AdminListItem";
import { Users, FileText, LineChart, Settings } from "lucide-react";

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
    <AdminLayout title="Admin Dashboard" backTo="/">
      <nav className="divide-y">
        <AdminListItem
          to="/admin/users"
          icon={<Users className="h-5 w-5 text-primary" />}
          title="User Management"
          description="Manage user accounts and permissions"
        />
        
        <AdminListItem
          to="/admin/content"
          icon={<FileText className="h-5 w-5 text-primary" />}
          title="Content Management"
          description="Manage timeline content and entries"
        />

        <AdminListItem
          to="/admin/analytics"
          icon={<LineChart className="h-5 w-5 text-primary" />}
          title="Analytics"
          description="View site statistics and user engagement"
        />

        <AdminListItem
          to="/admin/settings"
          icon={<Settings className="h-5 w-5 text-primary" />}
          title="Settings"
          description="Configure site settings and preferences"
        />
      </nav>
    </AdminLayout>
  );
};

export default Admin;