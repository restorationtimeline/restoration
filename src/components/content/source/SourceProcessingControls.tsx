import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSourceId } from "@/hooks/useQueueStatus";

interface SourceProcessingControlsProps {
  filePath: string;
  fileType: string;
  onReprocess?: () => void;
}

export function SourceProcessingControls({ 
  filePath, 
  fileType,
  onReprocess 
}: SourceProcessingControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleReprocess = async () => {
    if (!filePath || fileType !== 'pdf') return;

    setIsProcessing(true);
    try {
      const sourceId = getSourceId(filePath);
      const { error } = await supabase.functions.invoke('pdf-splitter', {
        body: { 
          sourceId,
          filePath,
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

  if (fileType !== 'pdf') return null;

  return (
    <Button 
      onClick={handleReprocess}
      disabled={isProcessing}
      variant="secondary"
      size="sm"
    >
      {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Reprocess PDF
    </Button>
  );
}