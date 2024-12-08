import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserAvatar } from "./UserAvatar";
import { detectFaceInImage } from "@/utils/faceDetection";

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
      const hasFace = await detectFaceInImage(file);
      if (!hasFace) {
        toast({
          title: "Invalid Profile Photo",
          description: "Please upload a photo that clearly shows a face.",
          variant: "destructive"
        });
        setIsUploadingPhoto(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
      
      // Call onPhotoUpdated after a short delay to ensure state updates have propagated
      setTimeout(() => {
        onPhotoUpdated();
        setIsUploadingPhoto(false);
      }, 100);
    } catch (error) {
      console.error("Error updating profile photo:", error);
      toast({
        title: "Error",
        description: "Failed to update profile photo",
        variant: "destructive",
      });
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <UserAvatar photoUrl={photoUrl} size="large" />
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