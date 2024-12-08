import { UnifiedSourceInput } from "./UnifiedSourceInput";
import { SourcesList } from "./SourcesList";

interface ContentContainerProps {
  title: string;
  setTitle: (value: string) => void;
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onCitationSubmit: (citation: string) => void;
  isSubmitting: boolean;
  sources: any[];
}

export const ContentContainer = ({
  title,
  setTitle,
  onFileUpload,
  onUrlSubmit,
  onCitationSubmit,
  isSubmitting,
  sources,
}: ContentContainerProps) => {
  return (
    <main className="flex-1 overflow-auto pt-16">
      <div className="container mx-auto p-6 space-y-6">
        <UnifiedSourceInput
          title={title}
          setTitle={setTitle}
          onFileUpload={onFileUpload}
          onUrlSubmit={onUrlSubmit}
          onCitationSubmit={onCitationSubmit}
          isSubmitting={isSubmitting}
        />
        <SourcesList sources={sources || []} />
      </div>
    </main>
  );
};