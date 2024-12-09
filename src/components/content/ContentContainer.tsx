import { useState } from "react";
import { FileUploadCard } from "./FileUploadCard";

interface ContentContainerProps {
  title: string;
  setTitle: (value: string) => void;
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onCitationSubmit: (citation: string) => void;
  isSubmitting: boolean;
}

export const ContentContainer = ({
  title,
  setTitle,
  onFileUpload,
  onUrlSubmit,
  onCitationSubmit,
  isSubmitting,
}: ContentContainerProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSubmit = () => {
    if (file) {
      onFileUpload(file);
      setFile(null);
    }
  };

  return (
    <main className="flex-1 overflow-auto pt-16">
      <div className="container mx-auto p-6 space-y-6">
        <FileUploadCard
          title={title}
          setTitle={setTitle}
          file={file}
          setFile={setFile}
          onSubmit={handleFileSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
};