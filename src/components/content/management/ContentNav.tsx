import { Plus, BookOpen, Route, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ContentNav = () => {
  return (
    <nav className="flex flex-col w-full">
      <div className="border-b">
        <div className="container mx-auto px-4 py-2">
          <h2 className="text-lg font-semibold">Content Management</h2>
        </div>
      </div>
      
      <div className="divide-y">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
        >
          <Link to="/admin/content/sources">
            <div className="flex items-center gap-4">
              <Plus className="h-5 w-5 text-primary" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-base font-medium">Manage Sources</span>
                <span className="text-sm text-muted-foreground">
                  View and manage content sources
                </span>
              </div>
            </div>
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
        >
          <Link to="/admin/content/original">
            <div className="flex items-center gap-4">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-base font-medium">Original Content</span>
                <span className="text-sm text-muted-foreground">
                  Create and manage original content
                </span>
              </div>
            </div>
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
        >
          <Link to="/admin/content/series">
            <div className="flex items-center gap-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-base font-medium">Content Series</span>
                <span className="text-sm text-muted-foreground">
                  Create and manage content series
                </span>
              </div>
            </div>
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className="w-full justify-between px-4 py-6 h-auto hover:bg-accent"
        >
          <Link to="/admin/content/learning-paths">
            <div className="flex items-center gap-4">
              <Route className="h-5 w-5 text-primary" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-base font-medium">Learning Paths</span>
                <span className="text-sm text-muted-foreground">
                  Design educational learning paths
                </span>
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </nav>
  );
};