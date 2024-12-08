import { useState } from "react";
import { UserRoleSelect } from "./UserRoleSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserDetailsProps = {
  user: {
    id: string;
    email?: string;
    created_at: string;
    profile?: {
      display_name: string | null;
      role: string | null;
      full_name: string | null;
    };
  };
};

export function UserDetails({ user }: UserDetailsProps) {
  const [fullName, setFullName] = useState(user.profile?.full_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Full name updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update full name",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] px-6">
      <div className="space-y-6 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {user.profile?.display_name || user.email || "Unnamed User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            User details and management
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Full Name</h3>
              <div className="flex gap-2">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="max-w-md"
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
          <div>
            <h3 className="mb-2 text-lg font-medium">Role</h3>
            <UserRoleSelect userId={user.id} currentRole={user.profile?.role} />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Joined</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}