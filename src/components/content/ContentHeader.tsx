import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Plus, Globe, Book, FileText, Video, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ContentHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/content">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Sources</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link to="/admin/content/new?type=website">
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </DropdownMenuItem>
              </Link>
              <Link to="/admin/content/new?type=book">
                <DropdownMenuItem>
                  <Book className="mr-2 h-4 w-4" />
                  Book
                </DropdownMenuItem>
              </Link>
              <Link to="/admin/content/new?type=article">
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Article
                </DropdownMenuItem>
              </Link>
              <Link to="/admin/content/new?type=video">
                <DropdownMenuItem>
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </DropdownMenuItem>
              </Link>
              <Link to="/admin/content/new?type=podcast">
                <DropdownMenuItem>
                  <Mic className="mr-2 h-4 w-4" />
                  Podcast
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};