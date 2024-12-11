import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQueueStatus(filePath: string | undefined, fileType: string) {
  return useQuery({
    queryKey: ["pdf-queue-status", filePath],
    queryFn: async () => {
      if (!filePath || fileType !== 'pdf') return null;
      
      const sourceId = getSourceId(filePath);
      const { data, error } = await supabase
        .from('pdf_page_queue')
        .select('status')
        .eq('source_id', sourceId);

      if (error) throw error;
      
      const counts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return counts;
    },
    enabled: fileType === 'pdf',
    refetchInterval: 5000
  });
}

// Helper function to extract sourceId from file path
export const getSourceId = (filePath: string) => {
  const dirName = filePath.split('/')[0];
  return dirName.includes('.') ? dirName.split('.')[0] : dirName;
};