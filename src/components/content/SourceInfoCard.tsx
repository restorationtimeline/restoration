import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SourceMetadata } from "./source/SourceMetadata";
import { SourceUrlInfo } from "./source/SourceUrlInfo";
import { SourceCitationInfo } from "./source/SourceCitationInfo";
import { SourceFileInfo } from "./source/SourceFileInfo";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SourceInfoCardProps {
  source: {
    title: string;
    source_type: string;
    url?: string;
    citation?: string;
    file_path?: string;
    file_type?: string;
    created_at: string;
  };
  pageCount?: number;
  onReprocess?: () => void;
}

export function SourceInfoCard({ source, pageCount, onReprocess }: SourceInfoCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Extract sourceId from file_path, handling both old and new formats
  const getSourceId = (filePath: string) => {
    // First try to get the directory name (new format)
    const dirName = filePath.split('/')[0];
    // If it contains a file extension, it's the old format
    if (dirName.includes('.')) {
      // Remove the file extension
      return dirName.split('.')[0];
    }
    return dirName;
  };

  // Query the queue status for this source
  const { data: queueStatus } = useQuery({
    queryKey: ["pdf-queue-status", source.file_path ? getSourceId(source.file_path) : null],
    queryFn: async () => {
      if (!source.file_path || source.file_type !== 'pdf') return null;
      
      const sourceId = getSourceId(source.file_path);
      const { data, error } = await supabase
        .from('pdf_page_queue')
        .select('status')
        .eq('source_id', sourceId);

      if (error) throw error;
      
      const counts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return counts;
    },
    enabled: source.file_type === 'pdf',
    refetchInterval: 5000 // Refresh every 5 seconds while queue is processing
  });

  const handleReprocess = async () => {
    if (!source.file_path || source.file_type !== 'pdf') return;

    setIsProcessing(true);
    try {
      const sourceId = getSourceId(source.file_path);
      const { error } = await supabase.functions.invoke('pdf-splitter', {
        body: { 
          sourceId,
          filePath: source.file_path,
          force: true
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "PDF pages queued for processing",
      });

      if (onReprocess) {
        onReprocess();
      }
    } catch (error) {
      console.error('Error reprocessing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to queue PDF pages",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{source.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SourceMetadata
          title={source.title}
          sourceType={source.source_type}
          createdAt={source.created_at}
        />

        {source.url && <SourceUrlInfo url={source.url} />}
        {source.citation && <SourceCitationInfo citation={source.citation} />}
        
        {source.file_path && (
          <SourceFileInfo
            filePath={source.file_path}
            fileType={source.file_type || ''}
            pageCount={pageCount}
            queueStatus={queueStatus}
            onReprocess={handleReprocess}
            isProcessing={isProcessing}
          />
        )}
      </CardContent>
    </Card>
  );
}