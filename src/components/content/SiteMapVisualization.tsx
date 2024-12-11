import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "./sitemap/LoadingState";
import { EmptyState } from "./sitemap/EmptyState";
import { PageNode } from "./sitemap/PageNode";

interface Page {
  id: string;
  url: string;
  parent_url: string | null;
  title: string | null;
  depth: number;
  status: string;
}

interface SiteMapVisualizationProps {
  sourceId: string;
}

export function SiteMapVisualization({ sourceId }: SiteMapVisualizationProps) {
  const { data: pages, isLoading } = useQuery({
    queryKey: ["source-pages", sourceId],
    queryFn: async () => {
      const { data: website } = await supabase
        .from("websites")
        .select("id")
        .eq("source_id", sourceId)
        .single();

      if (!website) return [];

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("website_id", website.id)
        .order("depth", { ascending: true })
        .order("url", { ascending: true });

      if (error) throw error;
      return data as Page[];
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!pages?.length) {
    return <EmptyState />;
  }

  const buildPageTree = (pages: Page[]) => {
    const pageMap = new Map<string | null, Page[]>();
    
    pages.forEach(page => {
      const parentUrl = page.parent_url;
      if (!pageMap.has(parentUrl)) {
        pageMap.set(parentUrl, []);
      }
      pageMap.get(parentUrl)?.push(page);
    });

    const renderPageTree = (parentUrl: string | null = null, level: number = 0) => {
      const children = pageMap.get(parentUrl) || [];
      return children.map(page => (
        <div key={page.id}>
          <PageNode
            title={page.title}
            url={page.url}
            status={page.status}
            level={level}
          />
          {renderPageTree(page.url, level + 1)}
        </div>
      ));
    };

    return renderPageTree();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Map</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {buildPageTree(pages)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}