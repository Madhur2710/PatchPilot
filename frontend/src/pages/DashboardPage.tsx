import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRepositories } from "@/hooks/useRepositories";
import { useDeletePatchNotes, usePatchNotesHistory } from "@/hooks/usePatchNotes";
import { StatCard } from "@/components/common/StatCard";
import { RepositoryCard } from "@/components/common/RepositoryCard";
import { PatchNoteCard } from "@/components/common/PatchNoteCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorCard } from "@/components/common/ErrorCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { FolderGit2, Code2, FileText, GitBranch, ArrowRight } from "lucide-react";
import type { PatchNotesDocument, ReleaseItemResponse } from "@/types/api";
import { useAppSearch } from "@/components/layout/searchContext";

export function DashboardPage() {
  const user = useCurrentUser();
  const repos = useRepositories();
  const history = usePatchNotesHistory();
  const del = useDeletePatchNotes();
  const [toDelete, setToDelete] = useState<PatchNotesDocument | null>(null);
  const { query, setPlaceholder } = useAppSearch();

  useEffect(() => setPlaceholder("Search on this page…"), [setPlaceholder]);

  const filteredHistory = useMemo(() => {
    const list = history.data ?? [];
    if (!query.trim()) return list.slice(0, 5);
    const q = query.toLowerCase();
    return list
      .filter(
        (p) =>
          p.repositoryName?.toLowerCase().includes(q) ||
          p.content?.title?.toLowerCase().includes(q) ||
          p.content?.summary?.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [history.data, query]);

  const filteredRepos = useMemo(() => {
    const list = repos.data ?? [];
    if (!query.trim()) return list.slice(0, 6);
    const q = query.toLowerCase();
    return list
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.fullName.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [repos.data, query]);

  const linesAnalyzed = useMemo(() => {
    const list = history.data ?? [];
    let total = 0;
    for (const doc of list) {
      const categories = [
        doc.content?.features,
        doc.content?.bugFixes,
        doc.content?.breakingChanges,
        doc.content?.performanceImprovements,
        doc.content?.refactorings,
        doc.content?.additionalNotes,
      ];
      for (const items of categories) {
        for (const item of items ?? []) {
          for (const ev of item.evidence ?? []) {
            if (ev.startLine != null && ev.endLine != null) {
              total += Math.max(0, ev.endLine - ev.startLine + 1);
            }
          }
        }
      }
    }
    return total;
  }, [history.data]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Welcome back{user.data?.username ? `, ${user.data.username}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue generating AI-powered release notes.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={FolderGit2}
          label="Connected repositories"
          value={repos.data?.length ?? "—"}
        />
        <StatCard
          icon={FileText}
          label="Generated patch notes"
          value={history.data?.length ?? "—"}
        />
        <StatCard
          icon={Code2}
          label="Lines of code analysed"
          value={history.isLoading ? "—" : linesAnalyzed.toLocaleString()}
          hint="Each generation runs on the actual git diff."
        />
      </div>

      {/* Recent patch notes */}
      <section className="mt-10">
        <SectionHeader
          title="Recent patch notes"
          action={
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/history">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {history.isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : history.isError ? (
            <div className="md:col-span-2">
              <ErrorCard onRetry={() => history.refetch()} />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                icon={FileText}
                title="No patch notes generated yet"
                description="Connect a repository and generate your first release notes."
                action={
                  <Button asChild>
                    <Link to="/repositories">Connect a repository</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            filteredHistory.map((p) => (
              <PatchNoteCard key={p.id} patchNote={p} onDelete={setToDelete} />
            ))
          )}
        </div>
      </section>

      {/* Connected repositories */}
      <section className="mt-10">
        <SectionHeader
          title="Connected repositories"
          action={
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/repositories">
                View all repositories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          ) : filteredRepos.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                icon={GitBranch}
                title="No connected repositories yet"
                description="Connect a GitHub repository to start generating patch notes."
                action={
                  <Button asChild>
                    <Link to="/repositories">Connect a repository</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            filteredRepos.map((r) => <RepositoryCard key={r.id} repo={r} compact />)
          )}
        </div>
      </section>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete patch notes?"
        description="This will permanently remove these release notes. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (toDelete) del.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}
