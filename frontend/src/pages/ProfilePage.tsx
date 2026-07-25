import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRepositories } from "@/hooks/useRepositories";
import { usePatchNotesHistory } from "@/hooks/usePatchNotes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/common/Skeleton";
import { LogOut, Mail, Github } from "lucide-react";
import { clearToken } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";

export function ProfilePage() {
  const user = useCurrentUser();
  const repos = useRepositories();
  const history = usePatchNotesHistory();
  const qc = useQueryClient();

  function handleLogout() {
    clearToken();
    qc.clear();
    window.location.replace("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in with GitHub.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        {user.isLoading ? (
          <>
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="mt-4 h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-64" />
          </>
        ) : (
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {user.data?.avatarUrl ? (
                <AvatarImage
                  src={user.data.avatarUrl}
                  alt={user.data.username}
                />
              ) : null}
              <AvatarFallback>
                {user.data?.username?.slice(0, 2).toUpperCase() ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">
                {user.data?.username ?? "—"}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-3.5 w-3.5" />
                <a
                  href={`https://github.com/${user.data?.username ?? ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  @{user.data?.username ?? "—"}
                </a>
              </div>
              {user.data?.email ? (
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {user.data.email}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Repositories connected
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {repos.isLoading ? "—" : (repos.data?.length ?? 0)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Patch notes generated
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {history.isLoading ? "—" : (history.data?.length ?? 0)}
          </div>
        </div>
      </div>

      {/* TODO: Backend doesn't expose the account creation date on /users/me. */}

      <div className="mt-8">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
