import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export const SeriesList = () => {
  const { data: series, isLoading } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!series?.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">
        No series found. Create your first series to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="divide-y">
        {series.map((item) => (
          <Link
            key={item.id}
            to={`/admin/content/series/${item.id}`}
            className="block hover:bg-accent transition-colors"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium leading-none">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description || "No description provided"}
                  </p>
                </div>
                <Badge variant={item.status === "published" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">{item.series_type}</Badge>
                {item.featured && <Badge>Featured</Badge>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};