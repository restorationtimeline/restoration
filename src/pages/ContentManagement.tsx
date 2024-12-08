import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { UnifiedSourceInput } from "@/components/content/UnifiedSourceInput";
import { SourcesList } from "@/components/content/SourcesList";

const ContentManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing content sources
  const { data: sources, refetch: refetchSources } = useQuery({
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

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
      }
      
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const handleFileUpload = async (file: File) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please provide a title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!fileExt || !["pdf", "epub"].includes(fileExt)) {
        throw new Error("Invalid file type. Only PDF and EPUB files are allowed.");
      }

      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("content_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("content_sources")
        .insert({
          title,
          source_type: "file",
          file_path: filePath,
          file_type: fileExt,
          created_by: session.user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      setTitle("");
      refetchSources();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please provide a title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("content_sources")
        .insert({
          title,
          source_type: "url",
          url,
          created_by: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "URL source added successfully",
      });
      
      setTitle("");
      refetchSources();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitationSubmit = async (citation: string) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please provide a title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("content_sources")
        .insert({
          title,
          source_type: "manual",
          citation,
          created_by: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Citation added successfully",
      });
      
      setTitle("");
      refetchSources();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Content Management</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto pt-16">
        <div className="container mx-auto p-6 space-y-6">
          <UnifiedSourceInput
            title={title}
            setTitle={setTitle}
            onFileUpload={handleFileUpload}
            onUrlSubmit={handleUrlSubmit}
            onCitationSubmit={handleCitationSubmit}
            isSubmitting={isSubmitting}
          />
          
          <SourcesList sources={sources || []} />
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;