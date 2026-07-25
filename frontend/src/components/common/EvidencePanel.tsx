import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PatchEvidence } from "@/types/api";
import { ChevronDown, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidencePanelProps {
  evidence: PatchEvidence[] | null | undefined;
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  const [open, setOpen] = useState(false);
  const count = evidence?.length ?? 0;
  if (count === 0) return null;

  return (
    <div className="mt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="gap-1.5"
      >
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
        View Evidence ({count})
      </Button>

      {open ? (
        <div className="mt-3 space-y-3">
          {evidence!.map((ev, i) => (
            <EvidenceBlock key={i} evidence={ev} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EvidenceBlock({ evidence }: { evidence: PatchEvidence }) {
  const lineRange =
    evidence.startLine != null && evidence.endLine != null
      ? `${evidence.startLine}–${evidence.endLine}`
      : "";

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs">
        <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono font-medium text-foreground">
          {evidence.file}
        </span>
        {lineRange ? (
          <span className="font-mono text-muted-foreground">{lineRange}</span>
        ) : null}
        <Badge variant="outline" className="ml-auto text-[10px] uppercase">
          {evidence.changeType}
        </Badge>
      </div>
      <pre className="overflow-x-auto p-0 text-[12px] leading-relaxed">
        <code className="block font-mono">
          {evidence.patch.split("\n").map((line, i) => {
            const cls = line.startsWith("+")
              ? "diff-line-add"
              : line.startsWith("-")
                ? "diff-line-del"
                : line.startsWith("@@")
                  ? "diff-line-hunk"
                  : "text-muted-foreground";
            return (
              <span
                key={i}
                className={cn("block whitespace-pre px-3 py-[1px]", cls)}
              >
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
