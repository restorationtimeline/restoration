import { Route } from "react-router-dom";
import Admin from "@/pages/Admin";
import UserManagement from "@/pages/UserManagement";
import InviteUser from "@/pages/InviteUser";
import UserDetailsPage from "@/pages/UserDetailsPage";
import Analytics from "@/pages/Analytics";
import AdminSettings from "@/pages/AdminSettings";
import { RoleGuard } from "@/components/RoleGuard";

export const adminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <Admin />
      </RoleGuard>
    }
  />,
  <Route
    key="users"
    path="/admin/users"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <UserManagement />
      </RoleGuard>
    }
  />,
  <Route
    key="invite"
    path="/admin/users/invite"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <InviteUser />
      </RoleGuard>
    }
  />,
  <Route
    key="user-details"
    path="/admin/users/:userId"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <UserDetailsPage />
      </RoleGuard>
    }
  />,
  <Route
    key="analytics"
    path="/admin/analytics"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <Analytics />
      </RoleGuard>
    }
  />,
  <Route
    key="settings"
    path="/admin/settings"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <AdminSettings />
      </RoleGuard>
    }
  />,
];