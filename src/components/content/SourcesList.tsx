import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Link as LinkIcon, Quote } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Source = Database["public"]["Tables"]["content_sources"]["Row"];

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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Sources</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <CardContent className="space-y-4">
          {sources?.map((source) => (
            <div
              key={source.id}
              className="flex items-start gap-3 rounded-lg border p-4"
            >
              <div className="mt-1 text-muted-foreground">
                {getSourceIcon(source.source_type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-none">{source.title}</h3>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {source.work_type && (
                      <Badge variant="outline" className="whitespace-nowrap">
                        {source.work_type}
                      </Badge>
                    )}
                    {source.status && (
                      <div className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusColor(source.status)}`}>
                        {source.status}
                      </div>
                    )}
                  </div>
                </div>
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
      </ScrollArea>
    </Card>
  );
};