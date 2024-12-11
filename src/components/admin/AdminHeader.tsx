import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
  backTo: string;
  children?: React.ReactNode;
}

export const AdminHeader = ({ title, backTo, children }: AdminHeaderProps) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to={backTo}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </header>
  );
};