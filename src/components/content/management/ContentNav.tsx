import { Plus, BookOpen, Route, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const ContentNav = () => {
  return (
    <nav className="flex flex-col w-full">
      <div className="border-b">
        <div className="container mx-auto px-4 py-2">
          <h2 className="text-lg font-semibold">Content Management</h2>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4 space-y-4">
        <Link
          to="/admin/content/sources"
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
        >
          <Plus className="h-5 w-5 text-primary" />
          <div className="flex flex-col flex-1">
            <span className="font-medium">Manage Sources</span>
            <span className="text-sm text-muted-foreground">View and manage content sources</span>
          </div>
        </Link>

        <Link
          to="/admin/content/original"
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
        >
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex flex-col flex-1">
            <span className="font-medium">Original Content</span>
            <span className="text-sm text-muted-foreground">Create and manage original content</span>
          </div>
        </Link>

        <Link
          to="/admin/content/series"
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <div className="flex flex-col flex-1">
            <span className="font-medium">Content Series</span>
            <span className="text-sm text-muted-foreground">Create and manage content series</span>
          </div>
        </Link>

        <Link
          to="/admin/content/learning-paths"
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
        >
          <Route className="h-5 w-5 text-primary" />
          <div className="flex flex-col flex-1">
            <span className="font-medium">Learning Paths</span>
            <span className="text-sm text-muted-foreground">Design educational learning paths</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};