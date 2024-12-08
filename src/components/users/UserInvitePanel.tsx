import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { InviteUserForm } from "./InviteUserForm";

interface UserInvitePanelProps {
  showInvite: boolean;
  onClose: () => void;
}

export function UserInvitePanel({ showInvite, onClose }: UserInvitePanelProps) {
  return (
    <div 
      style={{
        transform: showInvite ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showInvite ? 1 : 0,
        transition: 'all 0.3s ease-out',
        position: 'absolute',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)'
      }}
      className="p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Invite User</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <InviteUserForm onSuccess={onClose} />
    </div>
  );
}