import { useState } from "react";
import { UserRoleSelect } from "./UserRoleSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfilePhoto } from "./UserProfilePhoto";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  display_name: z.string().nullable(),
  full_name: z.string().nullable(),
  role: z.string().nullable(),
});

type UserDetailsProps = {
  user: {
    id: string;
    email?: string;
    created_at: string;
    profile?: {
      display_name: string | null;
      role: string | null;
      full_name: string | null;
      profile_photo_url: string | null;
    };
  };
};

export function UserDetails({ user }: UserDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { invalidateUser } = useUserProfile(user.id);

  console.log("UserDetails rendered with user:", user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: user.profile?.display_name || null,
      full_name: user.profile?.full_name || null,
      role: user.profile?.role || null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", values);
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: values.display_name,
          full_name: values.full_name,
          role: values.role,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      console.log("Profile updated, invalidating cache");
      invalidateUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
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
          <UserProfilePhoto 
            userId={user.id}
            photoUrl={user.profile?.profile_photo_url}
            onPhotoUpdated={invalidateUser}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <UserRoleSelect
                      userId={user.id}
                      currentRole={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="mb-2 text-lg font-medium">Joined</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}