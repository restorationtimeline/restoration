import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const AuthCard = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes to show appropriate messages
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      console.log("Auth state changed:", event);
      
      switch (event) {
        case "USER_DELETED":
          toast({
            title: "Account deleted",
            description: "Your account has been successfully deleted",
          });
          break;
        case "PASSWORD_RECOVERY":
          toast({
            title: "Password recovery",
            description: "Check your email for password reset instructions",
          });
          break;
        case "SIGNED_OUT":
          toast({
            title: "Signed out",
            description: "You have been successfully signed out",
          });
          break;
        default:
          // Handle other events if needed
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Welcome to Restoration Timeline</CardTitle>
        <CardDescription>Sign in or create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                },
              },
            },
            style: {
              button: {
                borderRadius: '0.5rem',
                height: '2.5rem',
              },
              input: {
                borderRadius: '0.5rem',
              },
              container: {
                background: 'transparent',
              },
              message: {
                color: 'rgb(var(--destructive))',
              },
            },
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/auth/callback`}
          localization={{
            variables: {
              sign_in: {
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your password",
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
                loading_button_label: "Signing in ...",
              },
              sign_up: {
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your password",
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign up",
                loading_button_label: "Signing up ...",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};