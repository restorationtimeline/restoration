import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeleteSourceButtonProps {
  sourceId: string;
}

export function DeleteSourceButton({ sourceId }: DeleteSourceButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  let deleteTimer: number | null = null;

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

  return (
    <Button
      variant="destructive"
      className="w-full relative select-none"
      onMouseDown={handleDeleteStart}
      onMouseUp={handleDeleteCancel}
      onMouseLeave={handleDeleteCancel}
      disabled={isDeleting && deleteProgress === 100}
    >
      {isDeleting && (
        <div 
          className="absolute inset-0 bg-destructive/20 transition-all duration-75 ease-linear"
          style={{ width: `${deleteProgress}%` }}
        />
      )}
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? "Hold to delete..." : "Delete Source"}
    </Button>
  );
}