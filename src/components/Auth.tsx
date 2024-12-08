import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
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
            messages={{
              'Email not confirmed': 'Please check your email and click the confirmation link to verify your account.',
              'Invalid login credentials': 'Please check your credentials and try again.',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};