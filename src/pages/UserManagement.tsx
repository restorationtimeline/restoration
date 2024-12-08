import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserManagementHeader } from "@/components/users/UserManagementHeader";
import { UserSearch } from "@/components/users/UserSearch";
import { UserInvitePanel } from "@/components/users/UserInvitePanel";
import { UserList } from "@/components/users/UserList";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pullStartY = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth");
        throw new Error("Not authenticated");
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        throw new Error("Not authorized");
      }

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

  // Pull-to-search touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0 && !showSearch) {
      const pullMoveY = e.touches[0].clientY;
      const distance = Math.max(0, pullMoveY - pullStartY.current);
      setPullDistance(Math.min(distance, 100));
      
      if (distance > 60) {
        setShowSearch(true);
      }
    }
  };

  const handleTouchEnd = () => {
    setPullDistance(0);
    if (!showSearch) {
      setPullDistance(0);
    }
  };

  // Add touch event listeners
  const element = scrollRef.current;
  if (element) {
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }

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