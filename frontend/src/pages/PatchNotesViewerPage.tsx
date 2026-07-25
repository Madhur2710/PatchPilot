import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useDeletePatchNotes,
  usePatchNotes,
} from "@/hooks/usePatchNotes";
import { EvidencePanel } from "@/components/common/EvidencePanel";
import { Skeleton } from "@/components/common/Skeleton";
import { ErrorCard } from "@/components/common/ErrorCard";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Copy,
  Download,
  FileCode2,
  GitBranch,
  GitCommit,
  Trash2,
  Upload,
} from "lucide-react";
import { formatDate, shortSha } from "@/lib/format";
import { toast } from "sonner";
import type {
  PatchNotesDocument,
  PatchNotesResponse,
  ReleaseItemResponse,
} from "@/types/api";

interface Category {
  key: keyof Pick<
    PatchNotesResponse,
    | "features"
    | "bugFixes"
    | "breakingChanges"
    | "performanceImprovements"
    | "refactorings"
    | "additionalNotes"
  >;
  emoji: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { key: "features", emoji: "✨", label: "Features" },
  { key: "bugFixes", emoji: "🐛", label: "Bug Fixes" },
  { key: "breakingChanges", emoji: "⚠", label: "Breaking Changes" },
  {
    key: "performanceImprovements",
    emoji: "⚡",
    label: "Performance Improvements",
  },
  { key: "refactorings", emoji: "🧹", label: "Refactoring" },
  { key: "additionalNotes", emoji: "📝", label: "Additional Notes" },
];

export function PatchNotesViewerPage() {
  const { patchNotesId } = useParams({
    from: "/_app/history/$patchNotesId",
  });
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = usePatchNotes(patchNotesId);
  const del = useDeletePatchNotes();
  const [confirmDel, setConfirmDel] = useState(false);

  const stats = useMemo(() => computeStats(data), [data]);
  const changedFiles = useMemo(() => extractChangedFiles(data), [data]);

  if (isLoading) return <LoaderSkeleton />;
  if (isError || !data)
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorCard
          title="Couldn't load patch notes"
          onRetry={() => refetch()}
        />
      </div>
    );

  const content = data.content;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
      {/* Left sticky panel */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 gap-1.5 text-muted-foreground"
        >
          <Link to="/history">
            <ArrowLeft className="h-3.5 w-3.5" />
            History
          </Link>
        </Button>

        <div className="space-y-5 rounded-lg border border-border bg-card p-5 text-sm">
          <MetaRow icon={GitBranch} label="Repository" value={data.repositoryName} />
          <MetaRow
            icon={GitCommit}
            label="Base"
            value={<code className="font-mono text-xs">{shortSha(data.baseCommit)}</code>}
          />
          <MetaRow
            icon={GitCommit}
            label="Head"
            value={<code className="font-mono text-xs">{shortSha(data.headCommit)}</code>}
          />
          <MetaRow label="Generated" value={formatDate(data.createdAt)} />

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
            <MiniStat label="Files" value={stats.files} />
            <MiniStat label="Items" value={stats.items} />
          </div>
        </div>

        {changedFiles.length > 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <FileCode2 className="h-3.5 w-3.5" />
              Changed files ({changedFiles.length})
            </div>
            <ul className="max-h-80 space-y-1 overflow-y-auto text-xs">
              {changedFiles.map((f) => (
                <li
                  key={f}
                  className="truncate rounded px-2 py-1 font-mono text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  title={f}
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      {/* Right content */}
      <div className="min-w-0">
        {/* Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              navigator.clipboard.writeText(toMarkdown(data));
              toast.success("Copied as Markdown");
            }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              navigator.clipboard.writeText(toPlainText(data));
              toast.success("Copied as plain text");
            }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy Plain
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => downloadMarkdown(data)}
          >
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled
            title="Coming soon"
          >
            <Upload className="h-3.5 w-3.5" /> Publish to GitHub
            <Badge variant="secondary" className="ml-1 text-[9px]">
              Soon
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDel(true)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>

        {/* Title & summary */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {content.title || "Untitled release"}
          </h1>
        </div>
        {content.summary ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
            {content.summary}
          </div>
        ) : null}

        {/* Categories */}
        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => {
            const items = (content[cat.key] ?? []) as ReleaseItemResponse[];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat.key}>
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <span aria-hidden>{cat.emoji}</span>
                  {cat.label}
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    {items.length}
                  </Badge>
                </h2>
                <div className="mt-4 space-y-3">
                  {items.map((item, i) => (
                    <ReleaseItemCard key={i} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDel}
        onOpenChange={setConfirmDel}
        title="Delete patch notes?"
        description="This will permanently remove these release notes."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          await del.mutateAsync(data.id);
          navigate({ to: "/history" });
        }}
      />
    </div>
  );
}

function ReleaseItemCard({ item }: { item: ReleaseItemResponse }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold">{item.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <EvidencePanel evidence={item.evidence} />
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="h-3 w-3" /> : null}
        {label}
      </div>
      <div className="mt-1 truncate text-sm text-foreground">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold">{value}</div>
    </div>
  );
}

function LoaderSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
      <div>
        <Skeleton className="h-64 w-full" />
      </div>
      <div>
        <Skeleton className="mx-auto h-10 w-2/3" />
        <Skeleton className="mx-auto mt-6 h-20 w-full" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

function computeStats(doc: PatchNotesDocument | undefined) {
  if (!doc) return { files: 0, items: 0 };
  const items = CATEGORIES.reduce(
    (n, c) => n + (doc.content[c.key]?.length ?? 0),
    0,
  );
  const files = extractChangedFiles(doc).length;
  return { files, items };
}

function extractChangedFiles(doc: PatchNotesDocument | undefined): string[] {
  if (!doc) return [];
  const set = new Set<string>();
  for (const cat of CATEGORIES) {
    for (const item of doc.content[cat.key] ?? []) {
      for (const ev of item.evidence ?? []) {
        if (ev.file) set.add(ev.file);
      }
    }
  }
  return Array.from(set).sort();
}

function toMarkdown(doc: PatchNotesDocument): string {
  const c = doc.content;
  const lines: string[] = [];
  lines.push(`# ${c.title}`);
  if (c.summary) lines.push("", c.summary);
  for (const cat of CATEGORIES) {
    const items = c[cat.key];
    if (!items || items.length === 0) continue;
    lines.push("", `## ${cat.emoji} ${cat.label}`);
    for (const it of items) {
      lines.push("", `### ${it.title}`, it.description);
    }
  }
  return lines.join("\n");
}

function toPlainText(doc: PatchNotesDocument): string {
  return toMarkdown(doc).replace(/[#*_`]/g, "");
}

function downloadMarkdown(doc: PatchNotesDocument) {
  const blob = new Blob([toMarkdown(doc)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.content.title || "patch-notes"}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
