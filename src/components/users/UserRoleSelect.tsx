import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRoleSelectProps = {
  userId: string;
  currentRole: string | null;
  onChange: (value: string) => void;
};

export function UserRoleSelect({ currentRole, onChange }: UserRoleSelectProps) {
  return (
    <Select value={currentRole || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="moderator">Moderator</SelectItem>
      </SelectContent>
    </Select>
  );
}