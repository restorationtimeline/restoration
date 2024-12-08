import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type WebsiteConfigFormProps = {
  sourceId: string;
  initialConfig: {
    crawl_delay: number;
    max_depth: number;
    dynamic_rendering: boolean;
  };
  onSuccess: () => void;
};

export function WebsiteConfigForm({ sourceId, initialConfig, onSuccess }: WebsiteConfigFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState(initialConfig);

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
      
      onSuccess();
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

  return (
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
  );
}