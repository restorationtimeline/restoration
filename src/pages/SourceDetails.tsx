import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceInfoCard } from "@/components/content/SourceInfoCard";
import { DeleteSourceButton } from "@/components/content/DeleteSourceButton";

const SourceDetails = () => {
  const { sourceId } = useParams();

  const { data: source, isLoading: sourceLoading } = useQuery({
    queryKey: ["source", sourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_sources")
        .select("*")
        .eq("id", sourceId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: pageCount, isLoading: countLoading } = useQuery({
    queryKey: ["source-pages", sourceId],
    queryFn: async () => {
      if (!source?.file_path) return 0;
      
      const folderPath = `${sourceId}/pages`;
      const { data, error } = await supabase.storage
        .from("source_files")
        .list(folderPath);

      if (error) {
        console.error("Error fetching page count:", error);
        return 0;
      }

      return data.length;
    },
    enabled: !!source?.file_path,
  });

  if (sourceLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading source details...</p>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Source not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/content/sources">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Source Details</h1>
        </div>
      </header>

      <main className="container mx-auto p-6 pt-20 space-y-6">
        <SourceInfoCard source={source} pageCount={pageCount} />

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete a source, there is no going back. Please be certain.
              </p>
              <DeleteSourceButton sourceId={source.id} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SourceDetails;