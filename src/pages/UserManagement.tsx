import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, UserPlus } from "lucide-react";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";
import { UserListItem } from "@/components/users/UserListItem";
import { UserDetails } from "@/components/users/UserDetails";
import { useToast } from "@/components/ui/use-toast";

type UserWithProfile = {
  id: string;
  email?: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    role: string | null;
  };
};

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const pullStartY = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth");
        throw new Error("Not authenticated");
      }

      // Verify admin role
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

      // Call the admin function with the session token
      const { data, error } = await supabase.functions.invoke<{ users: UserWithProfile[] }>("admin", {
        body: { action: "listUsers" },
      });
      
      if (error) {
        console.error('Admin function error:', error);
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

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (scrollRef.current?.scrollTop === 0) {
        pullStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollRef.current?.scrollTop === 0 && !showSearch) {
        const pullMoveY = e.touches[0].clientY;
        const pullDistance = pullMoveY - pullStartY.current;
        
        if (pullDistance > 60) {
          setShowSearch(true);
        }
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [showSearch]);

  const filteredUsers = users?.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Users</h1>
          </div>
          <InviteUserDialog>
            <Button variant="ghost" size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </InviteUserDialog>
        </div>
      </header>

      <main className="flex flex-1 pt-16">
        <div className="flex w-full flex-col border-r md:w-80">
          {showSearch && (
            <div className="border-b p-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                autoFocus
                onBlur={() => !searchQuery && setShowSearch(false)}
              />
            </div>
          )}
          <div ref={scrollRef} className="flex-1 overflow-auto">
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="space-y-1 p-2">
                {isLoading ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    Loading users...
                  </p>
                ) : filteredUsers?.map((user) => (
                  <UserListItem
                    key={user.id}
                    email={user.email}
                    displayName={user.profile?.display_name}
                    role={user.profile?.role}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="hidden flex-1 md:block">
          {selectedUser ? (
            <UserDetails user={selectedUser} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
