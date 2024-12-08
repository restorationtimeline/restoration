import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, Link as LinkIcon, Quote } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

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
        <div className="container mx-auto p-6">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="url">Add URL</TabsTrigger>
              <TabsTrigger value="citation">Add Citation</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter source title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File (PDF or EPUB)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.epub"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button
                  onClick={handleFileUpload}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="urlTitle">Title</Label>
                  <Input
                    id="urlTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter source title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter source URL"
                  />
                </div>
                <Button
                  onClick={handleUrlSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add URL Source
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="citation" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citationTitle">Title</Label>
                  <Input
                    id="citationTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter source title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citation">Citation</Label>
                  <Textarea
                    id="citation"
                    value={citation}
                    onChange={(e) => setCitation(e.target.value)}
                    placeholder="Enter citation text"
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleCitationSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Quote className="mr-2 h-4 w-4" />
                  Add Citation
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Recent Sources</h2>
            <div className="space-y-4">
              {sources?.map((source) => (
                <div
                  key={source.id}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <h3 className="font-medium">{source.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {source.source_type}
                  </p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {source.url}
                    </a>
                  )}
                  {source.citation && (
                    <p className="mt-2 text-sm">{source.citation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;