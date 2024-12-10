import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export function SourceInfoCard({ source, pageCount }: SourceInfoCardProps) {
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
          <div>
            <h3 className="font-medium">File Information</h3>
            <p className="text-muted-foreground">
              Type: {source.file_type?.toUpperCase()}
            </p>
            {typeof pageCount !== 'undefined' && (
              <p className="text-muted-foreground">
                Extracted Pages: {pageCount}
              </p>
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