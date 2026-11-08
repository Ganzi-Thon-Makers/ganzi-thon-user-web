"use client";

import { toApiError } from "@/shared/api/error";
import { Button } from "@/shared/ui/Button";

interface PageErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function PageError({ error, onRetry }: PageErrorProps) {
  const { message } = toApiError(error);

  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-border p-6">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
