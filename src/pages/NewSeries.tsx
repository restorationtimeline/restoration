import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type SeriesType = Database["public"]["Enums"]["series_type"];

const NewSeries = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [seriesType, setSeriesType] = useState<SeriesType>("other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("series")
        .insert({
          title,
          description,
          series_type: seriesType,
          created_by: user.id,
          metadata: {
            initial_content: content,
          },
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Series created successfully",
      });

      navigate("/admin/content/series");
    } catch (error) {
      console.error("Error creating series:", error);
      toast({
        title: "Error",
        description: "Failed to create series",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-4">
          <Link to="/admin/content/series">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">New Content Series</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto pt-16">
        <div className="container mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter series title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter series description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Series Type</Label>
              <Select
                value={seriesType}
                onValueChange={(value: SeriesType) => setSeriesType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select series type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly_lesson">Weekly Lesson</SelectItem>
                  <SelectItem value="biographical">Biographical</SelectItem>
                  <SelectItem value="doctrinal_development">Doctrinal Development</SelectItem>
                  <SelectItem value="comparative_religion">Comparative Religion</SelectItem>
                  <SelectItem value="historical_analysis">Historical Analysis</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Initial Content</Label>
              <RichTextEditor onChange={setContent} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              Create Series
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSeries;