import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RepoResponse } from "@/types/api";
import { ExternalLink, Sparkles, Trash2, Lock, Globe } from "lucide-react";

interface RepositoryCardProps {
  repo: RepoResponse;
  onDisconnect?: (repo: RepoResponse) => void;
  compact?: boolean;
}

export function RepositoryCard({
  repo,
  onDisconnect,
  compact,
}: RepositoryCardProps) {
  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80 hover:bg-card/80">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 rounded-md">
          {repo.ownerAvatarUrl ? (
            <AvatarImage src={repo.ownerAvatarUrl} alt={repo.owner} />
          ) : null}
          <AvatarFallback className="rounded-md text-xs">
            {repo.owner.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {repo.name}
            </h3>
            <Badge variant="outline" className="gap-1 text-[10px] font-normal">
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
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {repo.fullName}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button asChild size="sm" className="gap-1.5">
          <Link
            to="/repositories/$repositoryId/generate"
            params={{ repositoryId: repo.id }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link
            to="/repositories/$repositoryId"
            params={{ repositoryId: repo.id }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        {onDisconnect && !compact ? (
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto text-muted-foreground hover:text-destructive"
            onClick={() => onDisconnect(repo)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
