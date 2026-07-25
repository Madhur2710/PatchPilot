import { useEffect, useMemo, useState } from "react";
import {
  useDeletePatchNotes,
  usePatchNotesHistory,
} from "@/hooks/usePatchNotes";
import { PatchNoteCard } from "@/components/common/PatchNoteCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorCard } from "@/components/common/ErrorCard";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatchNotesDocument } from "@/types/api";
import { useAppSearch } from "@/components/layout/searchContext";

export function HistoryPage() {
  const history = usePatchNotesHistory();
  const del = useDeletePatchNotes();
  const [toDelete, setToDelete] = useState<PatchNotesDocument | null>(null);
  const [repoFilter, setRepoFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const { query, setPlaceholder } = useAppSearch();

  useEffect(() => setPlaceholder("Search patch notes…"), [setPlaceholder]);

  const repos = useMemo(() => {
    const set = new Map<string, string>();
    for (const p of history.data ?? []) {
      set.set(p.repositoryId, p.repositoryName ?? p.repositoryId);
    }
    return Array.from(set.entries());
  }, [history.data]);

  const filtered = useMemo(() => {
    let list = history.data ?? [];
    if (repoFilter !== "all")
      list = list.filter((p) => p.repositoryId === repoFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.repositoryName?.toLowerCase().includes(q) ||
          p.content?.title?.toLowerCase().includes(q) ||
          p.content?.summary?.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [history.data, repoFilter, sort, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every generated release note is preserved here.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select value={repoFilter} onValueChange={setRepoFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All repositories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All repositories</SelectItem>
            {repos.map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {history.isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : history.isError ? (
          <div className="md:col-span-2">
            <ErrorCard onRetry={() => history.refetch()} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              icon={FileText}
              title={
                query || repoFilter !== "all"
                  ? "No matching patch notes"
                  : "No patch notes generated yet"
              }
              description={
                query || repoFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Generate your first patch notes from any connected repository."
              }
            />
          </div>
        ) : (
          filtered.map((p) => (
            <PatchNoteCard key={p.id} patchNote={p} onDelete={setToDelete} />
          ))
        )}
      </div>

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
