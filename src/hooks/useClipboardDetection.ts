import { useEffect, useState } from 'react';
import { detectSourceType } from '@/utils/sourceTypeDetection';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseClipboardDetectionProps {
  onUrlDetected: (url: string) => void;
}

export const useClipboardDetection = ({ onUrlDetected }: UseClipboardDetectionProps) => {
  const isMobile = useIsMobile();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkClipboard = async () => {
    try {
      // Only proceed if we have permission
      if (!hasPermission) {
        console.log("No clipboard permission yet");
        return;
      }

      const text = await navigator.clipboard.readText();
      console.log("Clipboard content:", text ? "Found content" : "Empty");
      
      if (text) {
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
      }
    } catch (err) {
      console.log("Clipboard error:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    // Request permission on mount
    const requestPermission = async () => {
      try {
        // Check if the Permissions API is available
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
          setHasPermission(result.state === 'granted');
          
          // Listen for permission changes
          result.addEventListener('change', () => {
            setHasPermission(result.state === 'granted');
          });
        } else {
          // Fallback for browsers that don't support Permissions API
          setHasPermission(true);
        }
      } catch (error) {
        console.log("Permission request error:", error);
        // Fallback to assuming we have permission if the API isn't available
        setHasPermission(true);
      }
    };

    requestPermission();

    // Set up periodic clipboard checks
    const interval = setInterval(checkClipboard, 3000);

    // If on mobile, we'll check less frequently to save battery
    const mobileInterval = isMobile ? setInterval(checkClipboard, 10000) : null;

    return () => {
      clearInterval(interval);
      if (mobileInterval) clearInterval(mobileInterval);
    };
  }, [onUrlDetected, isMobile, hasPermission]);
};