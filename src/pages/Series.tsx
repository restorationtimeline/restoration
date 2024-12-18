import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Series = () => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/content">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Content Series</h1>
          <div className="ml-auto">
            <Link to="/admin/content/series/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Series
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">Content series management coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Series;