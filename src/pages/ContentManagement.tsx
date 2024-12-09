import { useAuthCheck } from "@/hooks/useAuthCheck";
import { ContentHeader } from "@/components/content/management/ContentHeader";
import { ContentNav } from "@/components/content/management/ContentNav";

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
      <ContentHeader />
      <main className="flex-1 pt-16">
        <ContentNav />
      </main>
    </div>
  );
};

export default ContentManagement;