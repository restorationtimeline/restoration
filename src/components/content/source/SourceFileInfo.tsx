import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SourceFileInfoProps {
  filePath: string;
  fileType: string;
  pageCount?: number;
  queueStatus?: Record<string, number>;
  onReprocess?: () => void;
  isProcessing?: boolean;
}

export function SourceFileInfo({ 
  filePath, 
  fileType, 
  pageCount, 
  queueStatus,
  onReprocess,
  isProcessing 
}: SourceFileInfoProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">File Information</h3>
      <p className="text-muted-foreground">
        Type: {fileType?.toUpperCase()}
      </p>
      {typeof pageCount !== 'undefined' && (
        <p className="text-muted-foreground">
          Extracted Pages: {pageCount}
        </p>
      )}
      {queueStatus && Object.keys(queueStatus).length > 0 && (
        <div className="text-sm text-muted-foreground">
          Queue Status:
          <ul className="list-disc list-inside">
            {Object.entries(queueStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fileType === 'pdf' && onReprocess && (
        <Button 
          onClick={onReprocess}
          disabled={isProcessing}
          variant="secondary"
          size="sm"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reprocess PDF
        </Button>
      )}
    </div>
  );
}