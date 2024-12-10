import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const buildPageTree = (pages: Page[]) => {
    const pageMap = new Map<string | null, Page[]>();
    
    pages.forEach(page => {
      const parentUrl = page.parent_url;
      if (!pageMap.has(parentUrl)) {
        pageMap.set(parentUrl, []);
      }
      pageMap.get(parentUrl)?.push(page);
    });

    const renderPageNode = (page: Page, level: number = 0) => (
      <div
        key={page.id}
        className={cn(
          "flex items-start gap-2 py-2",
          level > 0 && "ml-6 border-l pl-4"
        )}
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{page.title || "Untitled"}</span>
          </div>
          <p className="text-sm text-muted-foreground break-all">{page.url}</p>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          page.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        )}>
          {page.status}
        </span>
      </div>
    );

    const renderPageTree = (parentUrl: string | null = null, level: number = 0) => {
      const children = pageMap.get(parentUrl) || [];
      return children.map(page => (
        <div key={page.id}>
          {renderPageNode(page, level)}
          {renderPageTree(page.url, level + 1)}
        </div>
      ));
    };

    return renderPageTree();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Map</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!pages?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Map</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No pages have been crawled yet
          </p>
        </CardContent>
      </Card>
    );
  }

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