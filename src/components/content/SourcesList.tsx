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

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {sources.map((source) => (
          <Card key={source.id}>
            <CardHeader>
              <CardTitle>{source.title}</CardTitle>
              <CardDescription>{source.source_type}</CardDescription>
            </CardHeader>
            <CardContent>
              {source.url && <p className="text-sm mb-4">{source.url}</p>}
              {source.citation && (
                <p className="text-sm text-muted-foreground">{source.citation}</p>
              )}
              {source.source_type === "url" && (
                <div className="mt-4">
                  <WebsiteConfig sourceId={source.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}