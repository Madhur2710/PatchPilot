import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/format";
import type { PatchNotesDocument } from "@/types/api";
import { Eye, GitCommit, Trash2 } from "lucide-react";

interface PatchNoteCardProps {
  patchNote: PatchNotesDocument;
  onDelete?: (p: PatchNotesDocument) => void;
}

export function PatchNoteCard({ patchNote, onDelete }: PatchNoteCardProps) {
  const content = patchNote.content;
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitCommit className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-foreground">
              {patchNote.repositoryName}
            </span>
            <span>·</span>
            <span>{formatRelative(patchNote.createdAt)}</span>
          </div>
          <h3 className="mt-2 line-clamp-1 text-base font-semibold text-foreground">
            {content?.title ?? "Untitled"}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {content?.summary ?? ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link to="/history/$patchNotesId" params={{ patchNotesId: patchNote.id }}>
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        {onDelete ? (
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(patchNote)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
