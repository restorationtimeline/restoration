import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const ContentManagement = () => {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Content Management</h1>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <nav className="divide-y">
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
            onClick={() => window.location.href = "/admin/content/sources"}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-medium">Manage Sources</span>
              <span className="text-sm text-muted-foreground">
                View and manage content sources
              </span>
            </div>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </nav>
      </main>
    </div>
  );
};

export default ContentManagement;