import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { SearchProvider } from "@/components/layout/searchContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getToken } from "@/lib/session";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [checkedToken, setCheckedToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const t = getToken();
    setHasToken(!!t);
    setCheckedToken(true);
    if (!t) navigate({ to: "/", replace: true });
  }, [navigate]);

  const userQuery = useCurrentUser();

  useEffect(() => {
    if (userQuery.isError) {
      // Interceptor already cleared token on 401; ensure we're on landing.
      navigate({ to: "/", replace: true });
    }
  }, [userQuery.isError, navigate]);

  if (!checkedToken || !hasToken || userQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Mobile drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-60 border-r-0 p-0">
            <AppSidebar onNavigate={() => setDrawerOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar
            user={userQuery.data}
            onOpenSidebar={() => setDrawerOpen(true)}
          />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SearchProvider>
  );
}
