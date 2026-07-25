import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useRepositories } from "@/hooks/useRepositories";
import { useBranches, useCommits } from "@/hooks/useGithub";
import { useGeneratePatchNotes } from "@/hooks/usePatchNotes";
import { usePatchNotesHistory } from "@/hooks/usePatchNotes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, GitBranch, ArrowLeft } from "lucide-react";
import { formatRelative, shortSha } from "@/lib/format";
import type { GitHubCommitResponse } from "@/types/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { toast } from "sonner";

const LOADING_MESSAGES = [
  "Loading repository…",
  "Analyzing commits…",
  "Processing diff…",
  "Generating AI release notes…",
];

export function GeneratePatchNotesPage() {
  const { repositoryId } = useParams({
    from: "/_app/repositories/$repositoryId/generate",
  });
  const navigate = useNavigate();

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

  const [branch, setBranch] = useState<string | undefined>(undefined);
  const effectiveBranch = branch ?? defaultBranch;

  const commits = useCommits(repositoryId, effectiveBranch);
  const [base, setBase] = useState<string | undefined>(undefined);
  const [head, setHead] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Reset commit selection when branch changes
    setBase(undefined);
    setHead(undefined);
  }, [effectiveBranch]);

  const generate = useGeneratePatchNotes();
  const history = usePatchNotesHistory();
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    if (!generate.isPending) return;
    const t = setInterval(() => {
      setMessageIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [generate.isPending]);

  async function handleGenerate() {
    if (!base || !head || base === head) return;
    try {
      await generate.mutateAsync({ repositoryId, base, head });
      const fresh = await history.refetch();
      const match = fresh.data?.find(
        (p) =>
          p.repositoryId === repositoryId &&
          p.baseCommit === base &&
          p.headCommit === head,
      );
      if (match) {
        navigate({
          to: "/history/$patchNotesId",
          params: { patchNotesId: match.id },
        });
      } else {
        navigate({ to: "/history" });
      }
    } catch {
      toast.error("Patch notes generation failed");
    }
  }

  if (generate.isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">
            Generating release notes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {LOADING_MESSAGES[messageIdx]}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            This may take up to a minute.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 gap-1.5 text-muted-foreground"
      >
        <Link to="/repositories/$repositoryId" params={{ repositoryId }}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to repository
        </Link>
      </Button>

      <h1 className="text-2xl font-semibold tracking-tight">
        Generate patch notes
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {repo ? repo.fullName : "Loading repository…"}
      </p>

      <div className="mt-8 space-y-6 rounded-lg border border-border bg-card p-6">
        {/* Branch */}
        <div>
          <label className="text-sm font-medium">Branch</label>
          <div className="mt-2">
            {branches.isLoading ? (
              <div className="h-10 animate-pulse rounded-md bg-muted" />
            ) : branches.isError ? (
              <ErrorCard onRetry={() => branches.refetch()} />
            ) : (
              <Select
                value={effectiveBranch}
                onValueChange={(v) => setBranch(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a branch" />
                </SelectTrigger>
                <SelectContent>
                  {(branches.data ?? []).map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      <span className="inline-flex items-center gap-2">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                        {b.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Base */}
        <div>
          <label className="text-sm font-medium">Base commit (older)</label>
          <CommitSelect
            commits={commits.data}
            loading={commits.isLoading}
            error={commits.isError}
            value={base}
            onChange={setBase}
            excludeSha={head}
            placeholder="Choose base commit"
          />
        </div>

        {/* Head */}
        <div>
          <label className="text-sm font-medium">Head commit (newer)</label>
          <CommitSelect
            commits={commits.data}
            loading={commits.isLoading}
            error={commits.isError}
            value={head}
            onChange={setHead}
            excludeSha={base}
            placeholder="Choose head commit"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
          <Button
            onClick={handleGenerate}
            disabled={!base || !head || base === head}
            className="gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Generate patch notes
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CommitSelectProps {
  commits: GitHubCommitResponse[] | undefined;
  loading: boolean;
  error: boolean;
  value: string | undefined;
  onChange: (v: string) => void;
  excludeSha?: string;
  placeholder: string;
}

function CommitSelect({
  commits,
  loading,
  error,
  value,
  onChange,
  excludeSha,
  placeholder,
}: CommitSelectProps) {
  if (loading)
    return <div className="mt-2 h-10 animate-pulse rounded-md bg-muted" />;
  if (error) return <div className="mt-2 text-sm text-destructive">Failed to load commits</div>;
  const list = (commits ?? []).filter((c) => c.sha !== excludeSha);
  return (
    <div className="mt-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {list.map((c) => (
            <SelectItem key={c.sha} value={c.sha}>
              <span className="flex min-w-0 flex-col items-start">
                <span className="truncate text-sm font-medium">
                  {c.commit.message.split("\n")[0]}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {shortSha(c.sha)} · {formatRelative(c.commit.author?.date)}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
