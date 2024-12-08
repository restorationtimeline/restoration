import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/admin-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search } from "lucide-react";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";
import { UserRoleSelect } from "@/components/users/UserRoleSelect";

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

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: users, error } = await adminClient.auth.admin.listUsers();
      if (error) throw error;

      const { data: profiles } = await adminClient
        .from("profiles")
        .select("id, display_name, role");

      const profilesMap = new Map(profiles?.map(p => [p.id, p]));

      return users.users.map(user => ({
        ...user,
        profile: profilesMap.get(user.id),
      })) as UserWithProfile[];
    },
  });

  const filteredUsers = users?.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-accent p-4">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <InviteUserDialog />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.profile?.display_name || "-"}</TableCell>
                        <TableCell>
                          <UserRoleSelect
                            userId={user.id}
                            currentRole={user.profile?.role}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;