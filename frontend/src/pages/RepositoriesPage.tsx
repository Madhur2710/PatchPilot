import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GitBranch } from "lucide-react";
import {
  useDisconnectRepository,
  useRepositories,
} from "@/hooks/useRepositories";
import { RepositoryCard } from "@/components/common/RepositoryCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorCard } from "@/components/common/ErrorCard";
import { ConnectRepositoryDialog } from "@/components/common/ConnectRepositoryDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAppSearch } from "@/components/layout/searchContext";
import type { RepoResponse } from "@/types/api";

export function RepositoriesPage() {
  const [connectOpen, setConnectOpen] = useState(false);
  const [toDelete, setToDelete] = useState<RepoResponse | null>(null);
  const repos = useRepositories();
  const disconnect = useDisconnectRepository();
  const { query, setPlaceholder } = useAppSearch();

  useEffect(() => setPlaceholder("Search repositories…"), [setPlaceholder]);

  const filtered = useMemo(() => {
    const list = repos.data ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q),
    );
  }, [repos.data, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Repositories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage repositories available for patch note generation.
          </p>
        </div>
        <Button onClick={() => setConnectOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Connect repository
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : repos.isError ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <ErrorCard onRetry={() => repos.refetch()} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              icon={GitBranch}
              title={
                query
                  ? "No repositories match your search"
                  : "No connected repositories yet"
              }
              description={
                query
                  ? "Try a different search term."
                  : "Connect a GitHub repository to get started."
              }
              action={
                query ? null : (
                  <Button onClick={() => setConnectOpen(true)}>
                    Connect a repository
                  </Button>
                )
              }
            />
          </div>
        ) : (
          filtered.map((r) => (
            <RepositoryCard key={r.id} repo={r} onDisconnect={setToDelete} />
          ))
        )}
      </div>

      <ConnectRepositoryDialog open={connectOpen} onOpenChange={setConnectOpen} />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Disconnect ${toDelete?.name ?? "repository"}?`}
        description="You can reconnect the repository at any time. Generated patch notes are preserved."
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => {
          if (toDelete) disconnect.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
