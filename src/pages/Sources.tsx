import { ContentHeader } from "@/components/content/ContentHeader";
import { SourcesList } from "@/components/content/SourcesList";

const Sources = () => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <ContentHeader />
      <main className="flex-1 overflow-auto pt-16">
        <div className="container mx-auto p-6 space-y-6">
          <SourcesList />
        </div>
      </main>
    </div>
  );
};

export default Sources;