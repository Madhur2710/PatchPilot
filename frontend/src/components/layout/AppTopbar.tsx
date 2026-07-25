import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import type { UserResponse } from "@/types/api";
import { useAppSearch } from "@/components/layout/searchContext";

interface AppTopbarProps {
  user: UserResponse | undefined;
  onOpenSidebar: () => void;
}

export function AppTopbar({ user, onOpenSidebar }: AppTopbarProps) {
  const { query, setQuery, placeholder } = useAppSearch();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative max-w-lg flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-9 pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <Avatar className="h-8 w-8">
          {user?.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.username} />
          ) : null}
          <AvatarFallback className="text-xs">
            {user?.username?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline-block">
          {user?.username ?? "…"}
        </span>
      </div>
    </header>
  );
}
