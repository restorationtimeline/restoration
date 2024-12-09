import { useAuthCheck } from "@/hooks/useAuthCheck";
import { ContentHeader } from "@/components/content/management/ContentHeader";
import { ContentNav } from "@/components/content/management/ContentNav";
import { SeriesList } from "@/components/content/SeriesList";
import { useLocation } from "react-router-dom";

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
    <div className="flex h-screen flex-col bg-background">
      <ContentHeader />
      <main className="flex-1 pt-16">
        {showSeriesList ? <SeriesList /> : <ContentNav />}
      </main>
    </div>
  );
};

export default ContentManagement;