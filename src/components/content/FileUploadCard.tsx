import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileUploadCardProps {
  title: string;
  setTitle: (value: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const FileUploadCard = ({
  title,
  setTitle,
  file,
  setFile,
  onSubmit,
  isSubmitting,
}: FileUploadCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </CardContent>
    </Card>
  );
};