import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceMetadata } from "./source/SourceMetadata";
import { SourceUrlInfo } from "./source/SourceUrlInfo";
import { SourceCitationInfo } from "./source/SourceCitationInfo";
import { SourceFileInfo } from "./source/SourceFileInfo";
import { SourceProcessingControls } from "./source/SourceProcessingControls";
import { useQueueStatus } from "@/hooks/useQueueStatus";

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
  const { data: queueStatus } = useQueueStatus(source.file_path, source.file_type || '');

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
          <>
            <SourceFileInfo
              filePath={source.file_path}
              fileType={source.file_type || ''}
              pageCount={pageCount}
              queueStatus={queueStatus}
            />
            <SourceProcessingControls
              filePath={source.file_path}
              fileType={source.file_type || ''}
              onReprocess={onReprocess}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}