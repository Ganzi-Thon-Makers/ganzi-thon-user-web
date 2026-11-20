import type { ErrorBoundaryFallbackProps } from "@suspensive/react";

import { toApiError } from "@/shared/api/error";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { ModalDescription, ModalTitle } from "@/shared/ui/Modal";

export function BoothDetailLoading() {
  return (
    <div className="pointer-events-auto rounded-lg bg-gray800">
      <ModalTitle className="sr-only">부스 상세</ModalTitle>
      <ModalDescription render={<output />} className="sr-only">
        부스 정보를 불러오는 중이에요.
      </ModalDescription>
      <div className="aspect-252/101 rounded-t-lg bg-gray700 motion-safe:animate-pulse" />
      <div className="flex flex-col gap-4 px-5 pt-6 pb-5 motion-safe:animate-pulse">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-lh items-center text-title-sb-20">
              <div className="h-4 w-28 rounded-xs bg-gray700" />
            </div>
            <Badge variant="secondary">
              <span className="h-lh w-7" />
            </Badge>
          </div>
          <div className="flex h-lh items-center text-body-m-16">
            <div className="h-3 w-20 rounded-xs bg-gray700" />
          </div>
        </div>
        <div className="flex h-lh items-center text-body-m-16">
          <div className="h-3 w-3/4 rounded-xs bg-gray700" />
        </div>
      </div>
    </div>
  );
}

export function BoothDetailError({ error, reset }: ErrorBoundaryFallbackProps) {
  const { status, message } = toApiError(error);

  return (
    <div className="pointer-events-auto flex flex-col items-start gap-3 rounded-lg bg-gray800 px-5 pt-6 pb-5">
      <ModalTitle>부스 상세</ModalTitle>
      <ModalDescription render={<output />}>{message}</ModalDescription>
      {status !== 404 ? (
        <Button variant="secondary" onClick={reset}>
          다시 시도
        </Button>
      ) : null}
    </div>
  );
}
