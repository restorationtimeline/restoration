import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserProfile(userId: string) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Not authenticated");
      }

      const { data: users, error } = await supabase.functions.invoke<{ users: any[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) throw error;

      const user = users.users.find(u => u.id === userId);
      if (!user) throw new Error("User not found");

      return user;
    },
  });

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
  };

  return { user, isLoading, invalidateUser };
}