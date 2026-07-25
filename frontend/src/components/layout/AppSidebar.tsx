import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GitBranch,
  History,
  User,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearToken } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", url: "/repositories", icon: GitBranch },
  { title: "History", url: "/history", icon: History },
  { title: "Profile", url: "/profile", icon: User },
] as const;

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const qc = useQueryClient();

  function handleLogout() {
    clearToken();
    qc.clear();
    window.location.replace("/");
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight">PatchPilot</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active =
            pathname === item.url || pathname.startsWith(item.url + "/");
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
