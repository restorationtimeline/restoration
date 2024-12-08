import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type WebsiteConfigProps = {
  sourceId: string;
};

export function WebsiteConfig({ sourceId }: WebsiteConfigProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crawlerStatus, setCrawlerStatus] = useState<string | null>(null);
  const [crawlerError, setCrawlerError] = useState<string | null>(null);

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

  const [config, setConfig] = useState({
    crawl_delay: website?.crawl_delay || 2000,
    max_depth: website?.max_depth || 3,
    dynamic_rendering: website?.dynamic_rendering || false,
  });

  useEffect(() => {
    const subscription = supabase
      .channel('crawler-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'web_crawler_queue',
          filter: `source_id=eq.${sourceId}`,
        },
        (payload) => {
          const { status, error } = payload.new;
          setCrawlerStatus(status);
          setCrawlerError(error);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sourceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("websites")
        .update({
          crawl_delay: config.crawl_delay,
          max_depth: config.max_depth,
          dynamic_rendering: config.dynamic_rendering,
        })
        .eq("source_id", sourceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website configuration updated successfully",
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating website config:", error);
      toast({
        title: "Error",
        description: "Failed to update website configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressValue = () => {
    switch (crawlerStatus) {
      case 'completed':
        return 100;
      case 'processing':
        return 50;
      case 'pending':
        return 0;
      case 'failed':
        return 100;
      default:
        return 0;
    }
  };

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
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Crawler Status: {crawlerStatus || 'Not started'}</span>
                <span>{getProgressValue()}%</span>
              </div>
              <Progress value={getProgressValue()} />
            </div>
            
            {crawlerError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="mt-2">
                  {crawlerError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crawl_delay">Crawl Delay (ms)</Label>
            <Input
              id="crawl_delay"
              type="number"
              min="0"
              value={config.crawl_delay}
              onChange={(e) =>
                setConfig({ ...config, crawl_delay: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_depth">Maximum Crawl Depth</Label>
            <Input
              id="max_depth"
              type="number"
              min="1"
              value={config.max_depth}
              onChange={(e) =>
                setConfig({ ...config, max_depth: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="dynamic_rendering"
              checked={config.dynamic_rendering}
              onCheckedChange={(checked) =>
                setConfig({ ...config, dynamic_rendering: checked })
              }
            />
            <Label htmlFor="dynamic_rendering">Enable Dynamic Rendering</Label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}