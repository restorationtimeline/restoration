import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthCard = () => {
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
          providers={["google", "facebook"]}
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
        />
      </CardContent>
    </Card>
  );
};