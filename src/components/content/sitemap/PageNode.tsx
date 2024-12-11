import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageNodeProps {
  title: string | null;
  url: string;
  status: string;
  level?: number;
}

export function PageNode({ title, url, status, level = 0 }: PageNodeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 py-2",
        level > 0 && "ml-6 border-l pl-4"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{title || "Untitled"}</span>
        </div>
        <p className="text-sm text-muted-foreground break-all">{url}</p>
      </div>
      <span className={cn(
        "text-xs px-2 py-1 rounded-full",
        status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      )}>
        {status}
      </span>
    </div>
  );
}