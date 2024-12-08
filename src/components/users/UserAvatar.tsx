import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

type UserAvatarProps = {
  photoUrl: string | null | undefined;
  size?: "default" | "large";
};

export function UserAvatar({ photoUrl, size = "default" }: UserAvatarProps) {
  const sizeClasses = size === "large" ? "h-20 w-20" : "h-10 w-10";
  const fallbackSize = size === "large" ? "h-10 w-10" : "h-5 w-5";

  return (
    <Avatar className={sizeClasses}>
      <AvatarImage src={photoUrl || undefined} alt="Profile photo" />
      <AvatarFallback>
        <User className={fallbackSize} />
      </AvatarFallback>
    </Avatar>
  );
}