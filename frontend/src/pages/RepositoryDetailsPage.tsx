import { Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useRepositories } from "@/hooks/useRepositories";
import { useBranches, useCommits } from "@/hooks/useGithub";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSkeleton, Skeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorCard } from "@/components/common/ErrorCard";
import {
  GitBranch,
  GitCommit,
  Sparkles,
  Lock,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { formatRelative, shortSha } from "@/lib/format";
import { cn } from "@/lib/utils";

export function RepositoryDetailsPage() {
  const { repositoryId } = useParams({
    from: "/_app/repositories/$repositoryId/",
  });
  const repos = useRepositories();
  const repo = repos.data?.find((r) => r.id === repositoryId);

  const branches = useBranches(repositoryId);

  const defaultBranch = useMemo(() => {
    const list = branches.data ?? [];
    return (
      list.find((b) => b.name === "main")?.name ??
      list.find((b) => b.name === "master")?.name ??
      list[0]?.name
    );
  }, [branches.data]);

  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined,
  );
  const branch = selectedBranch ?? defaultBranch;

  const commits = useCommits(repositoryId, branch);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 gap-1.5 text-muted-foreground"
      >
        <Link to="/repositories">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to repositories
        </Link>
      </Button>

      {/* Header */}
      {repos.isLoading || !repo ? (
        <div className="rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="mt-3 h-4 w-40" />
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 rounded-md">
              {repo.ownerAvatarUrl ? (
                <AvatarImage src={repo.ownerAvatarUrl} alt={repo.owner} />
              ) : null}
              <AvatarFallback className="rounded-md">
                {repo.owner.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {repo.fullName}
                </h1>
                <Badge variant="outline" className="gap-1 text-[10px]">
                  {repo.isPrivate ? (
                    <>
                      <Lock className="h-3 w-3" /> Private
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3" /> Public
                    </>
                  )}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                {defaultBranch ? (
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="h-3 w-3" /> {defaultBranch}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <Button asChild className="gap-1.5">
            <Link
              to="/repositories/$repositoryId/generate"
              params={{ repositoryId: repo.id }}
            >
              <Sparkles className="h-4 w-4" />
              Generate patch notes
            </Link>
          </Button>
        </div>
      )}

      {/* Branches */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Branches</h2>
        <div className="mt-4">
          {branches.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : branches.isError ? (
            <ErrorCard onRetry={() => branches.refetch()} />
          ) : (branches.data ?? []).length === 0 ? (
            <EmptyState icon={GitBranch} title="No branches found" />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {branches.data!.map((b) => {
                const active = b.name === branch;
                return (
                  <button
                    key={b.name}
                    onClick={() => setSelectedBranch(b.name)}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border bg-card hover:border-border/70",
                    )}
                  >
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate font-medium">{b.name}</span>
                    {b.protected ? (
                      <Badge
                        variant="outline"
                        className="ml-auto text-[10px]"
                      >
                        protected
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Commits */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent commits{branch ? ` on ${branch}` : ""}
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
          {!branch || commits.isLoading ? (
            <div className="divide-y divide-border">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : commits.isError ? (
            <div className="p-4">
              <ErrorCard onRetry={() => commits.refetch()} />
            </div>
          ) : (commits.data ?? []).length === 0 ? (
            <EmptyState
              icon={GitCommit}
              title="No commits found"
              className="border-0 bg-transparent"
            />
          ) : (
            <ul className="divide-y divide-border">
              {commits.data!.map((c) => (
                <li
                  key={c.sha}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-muted/30"
                >
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {c.commit.message.split("\n")[0]}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {c.commit.author?.name ?? "unknown"} ·{" "}
                      {formatRelative(c.commit.author?.date)}
                    </span>
                  </span>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {shortSha(c.sha)}
                  </code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
