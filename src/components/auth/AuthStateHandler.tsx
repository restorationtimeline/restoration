import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthStateHandlerProps {
  onAuthStateChange: (event: AuthChangeEvent, session: Session | null) => void;
}

export const AuthStateHandler = ({ onAuthStateChange }: AuthStateHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (session) {
        console.log("Initial session found");
      }
    };
    
    checkSession();

    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event, session);
      
      try {
        switch (event) {
          case "SIGNED_IN":
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            });
            navigate("/admin");
            break;
          case "SIGNED_OUT":
            toast({
              title: "Signed out",
              description: "You have been signed out.",
            });
            navigate("/");
            break;
          case "TOKEN_REFRESHED":
            console.log("Token refreshed successfully");
            break;
          case "USER_UPDATED":
            toast({
              title: "Profile updated",
              description: "Your profile has been updated.",
            });
            break;
          default:
            break;
        }
        onAuthStateChange(event, session);
      } catch (error) {
        console.error("Error handling auth change:", error);
        toast({
          title: "Error",
          description: "There was a problem with authentication",
          variant: "destructive",
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onAuthStateChange, toast]);

  return null;
};