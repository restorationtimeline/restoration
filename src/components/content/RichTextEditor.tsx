import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
}

export const RichTextEditor = ({ onChange, initialContent }: RichTextEditorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // We'll store the content directly as a string instead of JSON
    onChange?.(e.target.value);
  };

  return (
    <Textarea
      value={initialContent || ""}
      onChange={handleChange}
      className="min-h-[300px] w-full"
      placeholder="Enter your content here..."
    />
  );
};