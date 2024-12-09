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

      // Generate source ID upfront
      const sourceId = crypto.randomUUID();
      const filePath = `${sourceId}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('source_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create the content source record
      const { error: insertError } = await supabase
        .from("content_sources")
        .insert({
          id: sourceId,
          title,
          source_type: "file",
          file_path: filePath,
          file_type: fileExt,
          created_by: session.user.id,
        });

      if (insertError) throw insertError;

      // If it's a PDF, trigger the PDF splitter function
      if (fileExt === 'pdf') {
        const { error: splitError } = await supabase.functions.invoke('pdf-splitter', {
          body: { sourceId, filePath }
        });

        if (splitError) {
          console.error('Error splitting PDF:', splitError);
          toast({
            title: "Warning",
            description: "File uploaded but there was an error splitting the PDF. Please try processing it again later.",
            variant: "destructive",
          });
        }
      }

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
          status: 'pending'
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      // Trigger web crawler
      const response = await supabase.functions.invoke('web-crawler', {
        body: { sourceId: source.id }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "URL source added successfully and crawling started",
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