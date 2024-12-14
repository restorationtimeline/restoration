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
    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
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
        case "PASSWORD_RECOVERY":
          toast({
            title: "Password recovery",
            description: "Check your email for the recovery link.",
          });
          break;
        default:
          break;
      }
      onAuthStateChange(event, session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onAuthStateChange, toast]);

  return null;
};