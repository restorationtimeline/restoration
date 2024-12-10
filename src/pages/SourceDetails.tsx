import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const SourceDetails = () => {
  const { sourceId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  let deleteTimer: number | null = null;

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

  const handleDeleteStart = () => {
    setIsDeleting(true);
    setDeleteProgress(0);
    
    deleteTimer = window.setInterval(() => {
      setDeleteProgress(prev => {
        if (prev >= 100) {
          handleDeleteComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleDeleteCancel = () => {
    if (deleteTimer) clearInterval(deleteTimer);
    setIsDeleting(false);
    setDeleteProgress(0);
  };

  const handleDeleteComplete = async () => {
    if (deleteTimer) clearInterval(deleteTimer);
    setIsDeleting(false);
    
    try {
      // Delete the source
      const { error } = await supabase
        .from("content_sources")
        .delete()
        .eq("id", sourceId);

      if (error) throw error;

      toast({
        title: "Source deleted",
        description: "The source has been successfully deleted.",
      });

      navigate("/admin/content/sources");
    } catch (error) {
      console.error("Error deleting source:", error);
      toast({
        title: "Error",
        description: "Failed to delete the source. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <Card>
          <CardHeader>
            <CardTitle>{source.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Source Type</h3>
              <p className="text-muted-foreground">{source.source_type}</p>
            </div>

            {source.url && (
              <div>
                <h3 className="font-medium">URL</h3>
                <p className="text-muted-foreground">{source.url}</p>
              </div>
            )}

            {source.citation && (
              <div>
                <h3 className="font-medium">Citation</h3>
                <p className="text-muted-foreground">{source.citation}</p>
              </div>
            )}

            {source.file_path && (
              <div>
                <h3 className="font-medium">File Information</h3>
                <p className="text-muted-foreground">
                  Type: {source.file_type?.toUpperCase()}
                </p>
                {!countLoading && (
                  <p className="text-muted-foreground">
                    Extracted Pages: {pageCount}
                  </p>
                )}
              </div>
            )}

            <div>
              <h3 className="font-medium">Created At</h3>
              <p className="text-muted-foreground">
                {new Date(source.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete a source, there is no going back. Please be certain.
              </p>
              <Button
                variant="destructive"
                className="w-full relative"
                onMouseDown={handleDeleteStart}
                onMouseUp={handleDeleteCancel}
                onMouseLeave={handleDeleteCancel}
                disabled={isDeleting && deleteProgress === 100}
              >
                {isDeleting && (
                  <div 
                    className="absolute inset-0 bg-destructive/20"
                    style={{ width: `${deleteProgress}%` }}
                  />
                )}
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Hold to delete..." : "Delete Source"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SourceDetails;