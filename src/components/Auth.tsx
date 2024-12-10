import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { AuthCard } from "./auth/AuthCard";

export const Auth = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <AuthCard />
    </div>
  );
};