import { Plus, BookOpen, Route, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const ContentNav = () => {
  return (
    <nav className="space-y-1 p-2 mt-16">
      <Link
        to="/admin/content/sources"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <Plus className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Manage Sources</span>
          <span className="text-xs text-muted-foreground">View and manage content sources</span>
        </div>
      </Link>

      <Link
        to="/admin/content/original"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <FileText className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Original Content</span>
          <span className="text-xs text-muted-foreground">Create and manage original content</span>
        </div>
      </Link>

      <Link
        to="/admin/content/series"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <BookOpen className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Content Series</span>
          <span className="text-xs text-muted-foreground">Create and manage content series</span>
        </div>
      </Link>

      <Link
        to="/admin/content/learning-paths"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <Route className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Learning Paths</span>
          <span className="text-xs text-muted-foreground">Design educational learning paths</span>
        </div>
      </Link>
    </nav>
  );
};