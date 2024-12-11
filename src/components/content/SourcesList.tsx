import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebsiteConfig } from "./WebsiteConfig";
import { Link } from "react-router-dom";
import { FileText, Globe, Upload } from "lucide-react";

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
      case 'url':
        return <Globe className="h-5 w-5 text-primary" />;
      case 'file':
        return <Upload className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {sources.map((source) => (
          <Link key={source.id} to={`/admin/content/sources/${source.id}`}>
            <Card className="w-full transition-colors hover:bg-accent">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                {getSourceIcon(source.source_type)}
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{source.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Type: {source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {source.url && (
                  <p className="text-sm text-muted-foreground mb-4 truncate">
                    {source.url}
                  </p>
                )}
                {source.citation && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {source.citation}
                  </p>
                )}
                {source.source_type === "url" && (
                  <div className="mt-4 pt-4 border-t">
                    <WebsiteConfig sourceId={source.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}