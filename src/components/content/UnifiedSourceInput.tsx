import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { detectSourceType } from "@/utils/sourceTypeDetection";
import { useState, useRef } from "react";

interface UnifiedSourceInputProps {
  title: string;
  setTitle: (value: string) => void;
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onCitationSubmit: (citation: string) => void;
  isSubmitting: boolean;
}

export const UnifiedSourceInput = ({
  title,
  setTitle,
  onFileUpload,
  onUrlSubmit,
  onCitationSubmit,
  isSubmitting,
}: UnifiedSourceInputProps) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);
    const sourceType = detectSourceType(value);
    if (sourceType === 'url') {
      onUrlSubmit(value);
    } else if (sourceType === 'manual') {
      onCitationSubmit(value);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Add Source
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

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.epub"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
          />
          
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here or paste URL/citation below
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    // @ts-ignore - Experimental API
                    fileInputRef.current?.showPicker();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Mobile Upload
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">URL or Citation</Label>
          <Textarea
            id="source"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste a URL or enter a citation"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};