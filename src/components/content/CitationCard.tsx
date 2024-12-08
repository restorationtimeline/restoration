import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CitationCardProps {
  title: string;
  setTitle: (value: string) => void;
  citation: string;
  setCitation: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const CitationCard = ({
  title,
  setTitle,
  citation,
  setCitation,
  onSubmit,
  isSubmitting,
}: CitationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="h-5 w-5" />
          Add Citation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          <Quote className="mr-2 h-4 w-4" />
          Add Citation
        </Button>
      </CardContent>
    </Card>
  );
};