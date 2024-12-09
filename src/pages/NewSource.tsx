import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Clipboard, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { detectSourceType } from "@/utils/sourceTypeDetection";

const NewSource = () => {
  const [hasUrlInClipboard, setHasUrlInClipboard] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const sourceType = detectSourceType(text);
        setHasUrlInClipboard(sourceType === 'url');
      } catch (err) {
        console.log("Clipboard access denied or empty");
        setHasUrlInClipboard(false);
      }
    };

    checkClipboard();
    const interval = setInterval(checkClipboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const sourceType = detectSourceType(text);
      
      if (sourceType === 'url') {
        setTitle(text);
        toast({
          title: "Content pasted",
          description: "URL has been added",
        });
      } else {
        toast({
          title: "Error",
          description: "Clipboard content is not a valid URL",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to paste content from clipboard",
        variant: "destructive",
      });
    }
  };

  const createSourceMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      if (file) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !['pdf', 'epub'].includes(fileExt)) {
          throw new Error("Only PDF and EPUB files are allowed");
        }

        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('source_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error } = await supabase
          .from("content_sources")
          .insert({
            title: title || file.name,
            source_type: "file",
            file_path: filePath,
            file_type: fileExt,
            created_by: session.user.id,
          });

        if (error) throw error;
      } else if (title) {
        const sourceType = detectSourceType(title);
        const { error } = await supabase
          .from("content_sources")
          .insert({
            title,
            source_type: sourceType,
            url: sourceType === 'url' ? title : null,
            citation: sourceType === 'manual' ? title : null,
            created_by: session.user.id,
          });

        if (error) throw error;
      } else {
        throw new Error("Please provide either a file or content");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Source created successfully",
      });
      navigate("/admin/content/sources");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !file) {
      toast({
        title: "Error",
        description: "Please add some content or upload a file",
        variant: "destructive",
      });
      return;
    }
    createSourceMutation.mutate();
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/content/sources">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">New Source</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto pt-16">
        <div className="container mx-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title or URL</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter source title or URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File Upload (PDF or EPUB)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.epub"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createSourceMutation.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                Create Source
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handlePaste}
                disabled={!hasUrlInClipboard}
                className="flex items-center gap-2"
              >
                <Clipboard className="h-4 w-4" />
                Paste URL
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSource;