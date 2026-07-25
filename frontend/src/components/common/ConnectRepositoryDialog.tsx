import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Github } from "lucide-react";
import {
  useConnectRepositories,
  useGithubRepositories,
  useRepositories,
} from "@/hooks/useRepositories";
import type { GitHubRepositoryResponse } from "@/types/api";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorCard } from "@/components/common/ErrorCard";

interface ConnectRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectRepositoryDialog({
  open,
  onOpenChange,
}: ConnectRepositoryDialogProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const githubReposQuery = useGithubRepositories(open);
  const connectedQuery = useRepositories();
  const connectMutation = useConnectRepositories();

  const connectedGithubIds = useMemo(() => {
    const s = new Set<number>();
    for (const r of connectedQuery.data ?? []) s.add(r.githubRepositoryId);
    return s;
  }, [connectedQuery.data]);

  const filtered = useMemo(() => {
    const list = githubReposQuery.data ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.full_name.toLowerCase().includes(q) ||
        r.owner.login.toLowerCase().includes(q),
    );
  }, [githubReposQuery.data, search]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConnect() {
    const requests = Array.from(selected).map((githubRepositoryId) => ({
      githubRepositoryId,
    }));
    if (requests.length === 0) return;
    await connectMutation.mutateAsync(requests);
    setSelected(new Set());
    setSearch("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect a repository</DialogTitle>
          <DialogDescription>
            Choose one or more GitHub repositories to make available for patch
            note generation.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories..."
            className="pl-9"
          />
        </div>

        <div className="max-h-[380px] min-h-[280px] overflow-y-auto rounded-md border border-border">
          {githubReposQuery.isLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading repositories...
            </div>
          ) : githubReposQuery.isError ? (
            <div className="p-4">
              <ErrorCard
                title="Couldn't load GitHub repositories"
                onRetry={() => githubReposQuery.refetch()}
              />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Github}
              title="No repositories found"
              description={
                search ? "Try a different search term." : "No repositories available."
              }
              className="border-0 bg-transparent"
            />
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((repo: GitHubRepositoryResponse) => {
                const alreadyConnected = connectedGithubIds.has(repo.id);
                const isChecked = selected.has(repo.id);
                return (
                  <li
                    key={repo.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <Checkbox
                      checked={isChecked}
                      disabled={alreadyConnected}
                      onCheckedChange={() => toggle(repo.id)}
                      aria-label={`Select ${repo.full_name}`}
                    />
                    <Avatar className="h-8 w-8 rounded-md">
                      {repo.owner.avatar_url ? (
                        <AvatarImage
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                        />
                      ) : null}
                      <AvatarFallback className="rounded-md text-xs">
                        {repo.owner.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {repo.name}
                        </span>
                        {repo.isPrivate ? (
                          <Badge variant="outline" className="text-[10px]">
                            Private
                          </Badge>
                        ) : null}
                        {alreadyConnected ? (
                          <Badge className="bg-success/20 text-success text-[10px] hover:bg-success/20">
                            Connected
                          </Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {repo.full_name}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={selected.size === 0 || connectMutation.isPending}
          >
            {connectMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>Connect {selected.size > 0 ? `(${selected.size})` : ""}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
