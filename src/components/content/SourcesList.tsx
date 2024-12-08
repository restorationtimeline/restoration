import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Link as LinkIcon, Quote } from "lucide-react";

interface Source {
  id: string;
  title: string;
  source_type: string;
  url?: string;
  citation?: string;
}

interface SourcesListProps {
  sources: Source[];
}

export const SourcesList = ({ sources }: SourcesListProps) => {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'url':
        return <LinkIcon className="h-4 w-4" />;
      case 'manual':
        return <Quote className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources?.map((source) => (
          <div
            key={source.id}
            className="flex items-start gap-3 rounded-lg border p-4"
          >
            <div className="mt-1 text-muted-foreground">
              {getSourceIcon(source.source_type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{source.title}</h3>
              <p className="text-sm text-muted-foreground">
                Type: {source.source_type}
              </p>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {source.url}
                </a>
              )}
              {source.citation && (
                <p className="mt-2 text-sm">{source.citation}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};