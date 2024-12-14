import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebsiteConfig } from "./WebsiteConfig";
import { Link } from "react-router-dom";
import { FileText, Globe, Upload, Book, Video, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SourcesList() {
  const { data: sources } = useQuery({
    queryKey: ["content-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_sources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!sources?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No sources added yet
      </div>
    );
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'book':
        return <Book className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'podcast':
        return <Mic className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const groupedSources = sources.reduce((acc: Record<string, any[]>, source) => {
    const type = source.source_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(source);
    return acc;
  }, {});

  const sourceTypeLabels: Record<string, string> = {
    website: 'Websites',
    book: 'Books',
    article: 'Articles',
    video: 'Videos',
    podcast: 'Podcasts',
    other: 'Other Sources'
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-6">
        {Object.entries(groupedSources).map(([sourceType, sourcesOfType]) => (
          <div key={sourceType} className="space-y-2">
            <h2 className="text-lg font-semibold px-4">
              {sourceTypeLabels[sourceType] || sourceTypeLabels.other}
            </h2>
            <div className="space-y-2">
              {sourcesOfType.map((source) => (
                <Link
                  key={source.id}
                  to={`/admin/content/sources/${source.id}`}
                  className="block"
                >
                  <div className="group p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "p-2 rounded-md",
                          source.status === "published" ? "bg-primary/10" : "bg-muted"
                        )}>
                          {getSourceIcon(source.source_type)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">
                            {source.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {source.citation || source.url || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="whitespace-nowrap">
                          {source.source_type}
                        </Badge>
                        <Badge 
                          variant={source.status === "published" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {source.status}
                        </Badge>
                      </div>
                    </div>
                    {source.source_type === "website" && (
                      <div className="mt-3 border-t pt-3">
                        <WebsiteConfig sourceId={source.id} />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}