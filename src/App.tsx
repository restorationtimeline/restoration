import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import InviteUser from "./pages/InviteUser";
import UserDetailsPage from "./pages/UserDetailsPage";
import ContentManagement from "./pages/ContentManagement";
import Sources from "./pages/Sources";
import Series from "./pages/Series";
import LearningPaths from "./pages/LearningPaths";
import Quizzes from "./pages/Quizzes";
import Analytics from "./pages/Analytics";
import AdminSettings from "./pages/AdminSettings";
import { Auth } from "./components/Auth";
import { RoleGuard } from "./components/RoleGuard";
import NewSource from "./pages/NewSource";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <Admin />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <UserManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/invite"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <InviteUser />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <UserDetailsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <ContentManagement />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content/sources"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <Sources />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content/series"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <Series />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content/learning-paths"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <LearningPaths />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content/quizzes"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <Quizzes />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/content/new"
            element={
              <RoleGuard allowedRoles={["admin", "editor"]}>
                <NewSource />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <Analytics />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <AdminSettings />
              </RoleGuard>
            }
          />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;