import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
        return;
      }
      
      if (session) {
        console.log("User already logged in, redirecting...");
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        navigate('/');
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      }
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
};