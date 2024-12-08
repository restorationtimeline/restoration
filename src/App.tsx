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
import Analytics from "./pages/Analytics";
import AdminSettings from "./pages/AdminSettings";
import { Auth } from "./components/Auth";

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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/invite" element={<InviteUser />} />
          <Route path="/admin/users/:userId" element={<UserDetailsPage />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;