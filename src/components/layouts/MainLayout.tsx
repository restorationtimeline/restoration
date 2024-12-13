import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-accent">
      <TopBar />
      {children}
      <Footer />
    </div>
  );
};