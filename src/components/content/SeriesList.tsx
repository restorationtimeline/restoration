import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    return <div className="p-4">Loading series...</div>;
  }

  if (!series?.length) {
    return (
      <div className="p-4 text-muted-foreground">
        No series found. Create your first series to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="grid gap-4 p-4">
        {series.map((item) => (
          <Link key={item.id} to={`/admin/content/series/${item.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {item.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">{item.series_type}</Badge>
                  {item.featured && <Badge>Featured</Badge>}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};