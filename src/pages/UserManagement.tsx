import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserManagementHeader } from "@/components/users/UserManagementHeader";
import { UserSearch } from "@/components/users/UserSearch";
import { UserInvitePanel } from "@/components/users/UserInvitePanel";
import { UserList } from "@/components/users/UserList";
import { usePullToSearch } from "@/hooks/usePullToSearch";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const { toast } = useToast();

  // Check authentication and admin status
  useAuthCheck();

  // Setup pull-to-search functionality
  const { scrollRef } = usePullToSearch({
    onSearchShow: () => setShowSearch(true),
    showSearch,
    setPullDistance,
  });

  // Fetch users data
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{ users: any[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data.users;
    },
    retry: false,
  });

  return (
    <div className="flex h-screen flex-col">
      <UserManagementHeader onInviteClick={() => setShowInvite(true)} />
      
      <main className="flex flex-1 pt-16">
        <div className="w-full">
          <UserSearch
            searchQuery={searchQuery}
            showSearch={showSearch}
            pullDistance={pullDistance}
            onSearchChange={setSearchQuery}
            onCloseSearch={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
          />

          <UserInvitePanel
            showInvite={showInvite}
            onClose={() => setShowInvite(false)}
          />

          <div ref={scrollRef} className="flex-1 overflow-auto">
            <UserList
              users={users || []}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;