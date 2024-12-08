import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSourceOperations = (refetchSources: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");

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

      // Insert the source first
      const { data: source, error: sourceError } = await supabase
        .from("content_sources")
        .insert({
          title,
          source_type: "url",
          url,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      // Add to web crawler queue
      const { error: queueError } = await supabase
        .from("web_crawler_queue")
        .insert({
          source_id: source.id,
        });

      if (queueError) throw queueError;

      toast({
        title: "Success",
        description: "URL source added successfully and queued for crawling",
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

  return {
    title,
    setTitle,
    isSubmitting,
    handleFileUpload,
    handleUrlSubmit,
    handleCitationSubmit,
  };
};