import { useEffect } from 'react';
import { detectSourceType } from '@/utils/sourceTypeDetection';
import { toast } from 'sonner';

interface UseClipboardDetectionProps {
  onUrlDetected: (url: string) => void;
}

export const useClipboardDetection = ({ onUrlDetected }: UseClipboardDetectionProps) => {
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const sourceType = detectSourceType(text);
        
        if (sourceType === 'url') {
          toast("URL detected in clipboard", {
            description: "Click to add as a source",
            action: {
              label: "Add URL",
              onClick: () => onUrlDetected(text),
            },
          });
        }
      } catch (err) {
        console.log("Clipboard access denied or empty");
      }
    };

    checkClipboard();
  }, [onUrlDetected]);
};