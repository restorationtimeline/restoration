import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from "@huggingface/transformers";

type UserProfilePhotoProps = {
  userId: string;
  photoUrl: string | null | undefined;
  onPhotoUpdated: () => void;
};

export function UserProfilePhoto({ userId, photoUrl, onPhotoUpdated }: UserProfilePhotoProps) {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { toast } = useToast();

  const validateFaceInImage = async (file: File): Promise<boolean> => {
    try {
      // Create object detection pipeline
      const detector = await pipeline(
        "object-detection",
        "Xenova/detr-resnet-50",
        { quantized: false }
      );

      // Convert File to base64 for processing
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Detect objects in the image
      const results = await detector(base64);
      
      // Check if any detected object is a person/face
      const hasFace = results.some((result: any) => 
        result.label === "person" && result.score > 0.7
      );

      if (!hasFace) {
        toast({
          title: "Invalid Profile Photo",
          description: "Please upload a photo that clearly shows a face.",
          variant: "destructive"
        });
      }

      return hasFace;
    } catch (error) {
      console.error("Face detection error:", error);
      // If face detection fails, we'll allow the upload but log the error
      return true;
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // Validate that the image contains a face
      const isValid = await validateFaceInImage(file);
      if (!isValid) {
        setIsUploadingPhoto(false);
        return;
      }

      console.log("Starting photo upload for user:", userId);
      const fileExt = file.name.split('.').pop();
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