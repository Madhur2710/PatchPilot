import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  message = "We couldn't complete this request. Please try again.",
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        {onRetry ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onRetry}
          >
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
