import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { AuthForm } from "./AuthForm";
import { AuthStateHandler } from "./AuthStateHandler";

export const AuthCard = () => {
  const handleAuthStateChange = (event: AuthChangeEvent, session: Session | null) => {
    console.log("Auth state changed:", event, session);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Sign in to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm />
        <AuthStateHandler onAuthStateChange={handleAuthStateChange} />
      </CardContent>
    </Card>
  );
};