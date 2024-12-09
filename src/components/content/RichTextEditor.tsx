import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

interface RichTextEditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
}

export const RichTextEditor = ({ onChange, initialContent }: RichTextEditorProps) => {
  // Creates a new editor instance
  const editor: BlockNoteEditor = useBlockNote({
    // Use defaultContent instead of initialContent
    defaultContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
  });

  // Add the change handler to the editor instance after creation
  editor.onEditorContentChange(() => {
    // Convert the editor's content to a JSON string and call the onChange handler
    const saveData = JSON.stringify(editor.topLevelBlocks);
    onChange?.(saveData);
  });

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      className="min-h-[300px] border rounded-md"
    />
  );
};