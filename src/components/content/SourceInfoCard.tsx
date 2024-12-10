import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

  const handleReprocess = async () => {
    if (!source.file_path || source.file_type !== 'pdf') return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke('pdf-splitter', {
        body: { 
          sourceId: source.file_path.split('/')[0],
          filePath: source.file_path,
          force: true
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "PDF reprocessing started successfully",
      });

      if (onReprocess) {
        onReprocess();
      }
    } catch (error) {
      console.error('Error reprocessing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to reprocess PDF",
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
        <div>
          <h3 className="font-medium">Source Type</h3>
          <p className="text-muted-foreground">{source.source_type}</p>
        </div>

        {source.url && (
          <div>
            <h3 className="font-medium">URL</h3>
            <p className="text-muted-foreground">{source.url}</p>
          </div>
        )}

        {source.citation && (
          <div>
            <h3 className="font-medium">Citation</h3>
            <p className="text-muted-foreground">{source.citation}</p>
          </div>
        )}

        {source.file_path && (
          <div className="space-y-2">
            <h3 className="font-medium">File Information</h3>
            <p className="text-muted-foreground">
              Type: {source.file_type?.toUpperCase()}
            </p>
            {typeof pageCount !== 'undefined' && (
              <p className="text-muted-foreground">
                Extracted Pages: {pageCount}
              </p>
            )}
            {source.file_type === 'pdf' && (
              <Button 
                onClick={handleReprocess}
                disabled={isProcessing}
                variant="secondary"
                size="sm"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reprocess PDF
              </Button>
            )}
          </div>
        )}

        <div>
          <h3 className="font-medium">Created At</h3>
          <p className="text-muted-foreground">
            {new Date(source.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}