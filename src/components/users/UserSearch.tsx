import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSearchProps {
  searchQuery: string;
  showSearch: boolean;
  pullDistance: number;
  onSearchChange: (value: string) => void;
  onCloseSearch: () => void;
}

export function UserSearch({
  searchQuery,
  showSearch,
  pullDistance,
  onSearchChange,
  onCloseSearch,
}: UserSearchProps) {
  return (
    <div 
      style={{ 
        transform: !showSearch ? `translateY(-${Math.max(0, 64 - pullDistance)}px)` : 'translateY(0)',
        opacity: pullDistance / 60,
        transition: showSearch ? 'all 0.3s ease-out' : 'none'
      }}
      className={cn(
        "border-b p-4 bg-background",
        !showSearch && "pointer-events-none"
      )}
    >
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          autoFocus={showSearch}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}