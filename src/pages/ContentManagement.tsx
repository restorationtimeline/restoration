import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { FileUploadCard } from "@/components/content/FileUploadCard";
import { UrlSourceCard } from "@/components/content/UrlSourceCard";
import { CitationCard } from "@/components/content/CitationCard";
import { SourcesList } from "@/components/content/SourcesList";

const ContentManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [citation, setCitation] = useState("");
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

  const handleFileUpload = async () => {
    if (!file || !title) {
      toast({
        title: "Error",
        description: "Please provide both a title and a file",
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
      
      setFile(null);
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

  const handleUrlSubmit = async () => {
    if (!url || !title) {
      toast({
        title: "Error",
        description: "Please provide both a title and a URL",
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
      
      setUrl("");
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

  const handleCitationSubmit = async () => {
    if (!citation || !title) {
      toast({
        title: "Error",
        description: "Please provide both a title and a citation",
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
      
      setCitation("");
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FileUploadCard
              title={title}
              setTitle={setTitle}
              file={file}
              setFile={setFile}
              onSubmit={handleFileUpload}
              isSubmitting={isSubmitting}
            />
            <UrlSourceCard
              title={title}
              setTitle={setTitle}
              url={url}
              setUrl={setUrl}
              onSubmit={handleUrlSubmit}
              isSubmitting={isSubmitting}
            />
            <CitationCard
              title={title}
              setTitle={setTitle}
              citation={citation}
              setCitation={setCitation}
              onSubmit={handleCitationSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <SourcesList sources={sources || []} />
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;