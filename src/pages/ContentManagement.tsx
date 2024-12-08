import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentContainer } from "@/components/content/ContentContainer";
import { useSourceOperations } from "@/hooks/useSourceOperations";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useClipboardDetection } from "@/hooks/useClipboardDetection";

const ContentManagement = () => {
  const { isLoading } = useAuthCheck();

  const { data: sources, refetch: refetchSources } = useQuery({
    queryKey: ["content-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_sources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const {
    title,
    setTitle,
    isSubmitting,
    handleFileUpload,
    handleUrlSubmit,
    handleCitationSubmit,
  } = useSourceOperations(refetchSources);

  useClipboardDetection({
    onUrlDetected: (url) => {
      setTitle("URL from clipboard");
      handleUrlSubmit(url);
    },
  });

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
      <ContentContainer
        title={title}
        setTitle={setTitle}
        onFileUpload={handleFileUpload}
        onUrlSubmit={handleUrlSubmit}
        onCitationSubmit={handleCitationSubmit}
        isSubmitting={isSubmitting}
        sources={sources}
      />
    </div>
  );
};

export default ContentManagement;