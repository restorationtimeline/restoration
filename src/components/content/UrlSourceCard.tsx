import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UrlSourceCardProps {
  title: string;
  setTitle: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const UrlSourceCard = ({
  title,
  setTitle,
  url,
  setUrl,
  onSubmit,
  isSubmitting,
}: UrlSourceCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Add URL Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          <Link className="mr-2 h-4 w-4" />
          Add URL Source
        </Button>
      </CardContent>
    </Card>
  );
};