import { useAuthCheck } from "@/hooks/useAuthCheck";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminListItem } from "@/components/admin/AdminListItem";
import { SeriesList } from "@/components/content/SeriesList";
import { useLocation } from "react-router-dom";
import { Plus, FileText, BookOpen, Route } from "lucide-react";

const ContentManagement = () => {
  const { isLoading } = useAuthCheck();
  const location = useLocation();
  const showSeriesList = location.pathname === "/admin/content/series";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout title="Content Management" backTo="/admin">
      {showSeriesList ? (
        <SeriesList />
      ) : (
        <nav className="divide-y">
          <AdminListItem
            to="/admin/content/sources"
            icon={<Plus className="h-5 w-5 text-primary" />}
            title="Manage Sources"
            description="View and manage content sources"
          />

          <AdminListItem
            to="/admin/content/original"
            icon={<FileText className="h-5 w-5 text-primary" />}
            title="Original Content"
            description="Create and manage original content"
          />

          <AdminListItem
            to="/admin/content/series"
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            title="Content Series"
            description="Create and manage content series"
          />

          <AdminListItem
            to="/admin/content/learning-paths"
            icon={<Route className="h-5 w-5 text-primary" />}
            title="Learning Paths"
            description="Design educational learning paths"
          />
        </nav>
      )}
    </AdminLayout>
  );
};

export default ContentManagement;