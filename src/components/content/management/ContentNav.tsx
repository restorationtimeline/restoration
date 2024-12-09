import { Plus, BookOpen, Route, ListChecks } from "lucide-react";
import { ContentNavButton } from "./ContentNavButton";

export const ContentNav = () => {
  return (
    <nav className="divide-y">
      <ContentNavButton
        title="Manage Sources"
        description="View and manage content sources"
        icon={Plus}
        href="/admin/content/sources"
      />
      <ContentNavButton
        title="Content Series"
        description="Create and manage content series"
        icon={BookOpen}
        href="/admin/content/series"
      />
      <ContentNavButton
        title="Learning Paths"
        description="Design educational learning paths"
        icon={Route}
        href="/admin/content/learning-paths"
      />
      <ContentNavButton
        title="Quizzes"
        description="Create and manage interactive quizzes"
        icon={ListChecks}
        href="/admin/content/quizzes"
      />
    </nav>
  );
};