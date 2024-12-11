import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  title: string;
  backTo: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminLayout = ({ title, backTo, headerContent, children }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <AdminHeader title={title} backTo={backTo}>
        {headerContent}
      </AdminHeader>
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
};