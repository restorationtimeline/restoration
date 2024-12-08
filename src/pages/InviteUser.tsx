import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InviteUserForm } from "@/components/users/InviteUserForm";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const InviteUser = () => {
  useAuthCheck();

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/users">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Invite New User</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-4">
        <InviteUserForm />
      </main>
    </div>
  );
};

export default InviteUser;