import { Route } from "react-router-dom";
import ContentManagement from "@/pages/ContentManagement";
import Sources from "@/pages/Sources";
import Series from "@/pages/Series";
import NewSeries from "@/pages/NewSeries";
import LearningPaths from "@/pages/LearningPaths";
import Quizzes from "@/pages/Quizzes";
import NewSource from "@/pages/NewSource";
import SourceDetails from "@/pages/SourceDetails";
import { RoleGuard } from "@/components/RoleGuard";

export const contentRoutes = [
  <Route
    key="content"
    path="/admin/content"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <ContentManagement />
      </RoleGuard>
    }
  />,
  <Route
    key="sources"
    path="/admin/content/sources"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <Sources />
      </RoleGuard>
    }
  />,
  <Route
    key="series"
    path="/admin/content/series"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <Series />
      </RoleGuard>
    }
  />,
  <Route
    key="new-series"
    path="/admin/content/series/new"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <NewSeries />
      </RoleGuard>
    }
  />,
  <Route
    key="learning-paths"
    path="/admin/content/learning-paths"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <LearningPaths />
      </RoleGuard>
    }
  />,
  <Route
    key="quizzes"
    path="/admin/content/quizzes"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <Quizzes />
      </RoleGuard>
    }
  />,
  <Route
    key="new-source"
    path="/admin/content/new"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <NewSource />
      </RoleGuard>
    }
  />,
  <Route
    key="source-details"
    path="/admin/content/sources/:sourceId"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <SourceDetails />
      </RoleGuard>
    }
  />,
];
