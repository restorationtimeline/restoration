import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Clipboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

const NewSource = () => {
  const [hasClipboardContent, setHasClipboardContent] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        setHasClipboardContent(!!text);
      } catch (err) {
        console.log("Clipboard access denied or empty");
        setHasClipboardContent(false);
      }
    };

    checkClipboard();
    const interval = setInterval(checkClipboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      toast({
        title: "Content pasted",
        description: "Clipboard content has been added to the editor",
      });
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
          title,
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
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                {hasClipboardContent && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePaste}
                    className="flex items-center gap-2"
                  >
                    <Clipboard className="h-4 w-4" />
                    Paste source
                  </Button>
                )}
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter or paste source content"
                className="min-h-[300px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createSourceMutation.isPending}
            >
              Create Source
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSource;