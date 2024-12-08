import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserProfilePhotoProps = {
  userId: string;
  photoUrl: string | null | undefined;
  onPhotoUpdated: () => void;
};

export function UserProfilePhoto({ userId, photoUrl, onPhotoUpdated }: UserProfilePhotoProps) {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      console.log("Starting photo upload for user:", userId);
      const fileExt = file.name.split('.').pop();
      // Use userId as filename, maintaining the original file extension
      const filePath = `${userId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      console.log("Photo uploaded, updating profile with URL:", publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      console.log("Profile updated successfully");
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
      
      onPhotoUpdated();
    } catch (error) {
      console.error("Error updating profile photo:", error);
      toast({
        title: "Error",
        description: "Failed to update profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={photoUrl || undefined} alt="Profile photo" />
        <AvatarFallback>
          <User className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile Photo</h3>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploadingPhoto}
            className="max-w-[200px]"
          />
          {isUploadingPhoto && <p className="text-sm text-muted-foreground">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}