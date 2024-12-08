import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CrawlerProgress } from "./CrawlerProgress";
import { WebsiteConfigForm } from "./WebsiteConfigForm";

type WebsiteConfigProps = {
  sourceId: string;
};

export function WebsiteConfig({ sourceId }: WebsiteConfigProps) {
  const { data: website, refetch } = useQuery({
    queryKey: ["website", sourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("source_id", sourceId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: crawlerQueue } = useQuery({
    queryKey: ["crawler-queue", sourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("web_crawler_queue")
        .select("*")
        .eq("source_id", sourceId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!website) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Configuration</CardTitle>
        <CardDescription>
          Configure crawling settings for this website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {crawlerQueue && (
          <CrawlerProgress 
            sourceId={sourceId}
            initialStatus={crawlerQueue.status}
            initialError={crawlerQueue.error}
          />
        )}

        <WebsiteConfigForm
          sourceId={sourceId}
          initialConfig={{
            crawl_delay: website.crawl_delay,
            max_depth: website.max_depth,
            dynamic_rendering: website.dynamic_rendering,
          }}
          onSuccess={refetch}
        />
      </CardContent>
    </Card>
  );
}