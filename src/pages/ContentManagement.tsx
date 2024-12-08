import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentContainer } from "@/components/content/ContentContainer";
import { useSourceOperations } from "@/hooks/useSourceOperations";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useEffect } from "react";
import { toast } from "sonner";
import { detectSourceType } from "@/utils/sourceTypeDetection";

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

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const sourceType = detectSourceType(text);
        
        if (sourceType === 'url') {
          toast("URL detected in clipboard", {
            description: "Click to add as a source",
            action: {
              label: "Add URL",
              onClick: () => {
                setTitle("URL from clipboard");
                handleUrlSubmit(text);
              },
            },
          });
        }
      } catch (err) {
        console.log("Clipboard access denied or empty");
      }
    };

    checkClipboard();
  }, []);

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