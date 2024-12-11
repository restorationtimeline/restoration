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
import { Badge } from "@/components/ui/badge";

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
      <div className="divide-y">
        {sources.map((source) => (
          <Link
            key={source.id}
            to={`/admin/content/sources/${source.id}`}
            className="block hover:bg-accent transition-colors"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {getSourceIcon(source.source_type)}
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">
                      {source.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {source.citation || source.url || "No description provided"}
                    </p>
                  </div>
                </div>
                <Badge variant={source.status === "published" ? "default" : "secondary"}>
                  {source.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">{source.source_type}</Badge>
                {source.source_type === "url" && (
                  <div className="mt-2">
                    <WebsiteConfig sourceId={source.id} />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}