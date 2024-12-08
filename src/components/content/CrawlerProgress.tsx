import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type CrawlerProgressProps = {
  status: string | null;
  error: string | null;
};

export function CrawlerProgress({ status, error }: CrawlerProgressProps) {
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