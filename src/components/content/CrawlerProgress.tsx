import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type CrawlerProgressProps = {
  sourceId: string;
  initialStatus?: string | null;
  initialError?: string | null;
};

type CrawlerStatus = {
  status: string | null;
  error: string | null;
};

export function CrawlerProgress({ sourceId, initialStatus, initialError }: CrawlerProgressProps) {
  const [status, setStatus] = useState<string | null>(initialStatus || null);
  const [error, setError] = useState<string | null>(initialError || null);

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel('crawler-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'web_crawler_queue',
          filter: `source_id=eq.${sourceId}`,
        },
        (payload) => {
          if (payload.new) {
            const newStatus = payload.new as CrawlerStatus;
            setStatus(newStatus.status);
            setError(newStatus.error);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [sourceId]);

  const getProgressValue = () => {
    switch (status) {
      case 'completed':
        return 100;
      case 'processing':
        return 50;
      case 'pending':
        return 0;
      case 'failed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Crawler Status: {status || 'Not started'}</span>
          <span>{getProgressValue()}%</span>
        </div>
        <Progress value={getProgressValue()} />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}