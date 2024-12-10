import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";

export const TopBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setIsLoggedIn(!!session);
      
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuthStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="h-10 bg-background border-b flex items-center px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Restoration Timeline
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Area
            </Link>
          )}
          {!isLoggedIn && (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};