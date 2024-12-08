import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Clipboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { detectSourceType } from "@/utils/sourceTypeDetection";

const NewSource = () => {
  const [hasUrlInClipboard, setHasUrlInClipboard] = useState(false);
  const [content, setContent] = useState("");
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
        setContent(text);
        toast({
          title: "Content pasted",
          description: "URL has been added to the editor",
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

      const { error } = await supabase
        .from("content_sources")
        .insert({
          title: "Untitled Source",
          source_type: "manual",
          citation: content,
          created_by: session.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Source created successfully",
      });
      navigate("/admin/content");
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
    if (!content) {
      toast({
        title: "Error",
        description: "Please add some content",
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
          <Link to="/admin/content">
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
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter or paste source content"
              className="min-h-[300px]"
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createSourceMutation.isPending}
              >
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
                Paste source
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSource;