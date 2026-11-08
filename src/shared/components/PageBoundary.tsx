"use client";

import { ErrorBoundary, type ErrorBoundaryFallbackProps, Suspense } from "@suspensive/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { PageError } from "./PageError";
import { PageSkeleton } from "./PageSkeleton";

interface PageBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** SSR로 전환한 페이지에서만 false로 둔다. */
  clientOnly?: boolean;
}

function PageErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  return <PageError error={error} onRetry={reset} />;
}

/**
 * 모든 페이지의 기본 로딩·에러 경계.
 *
 * clientOnly: 서버(빌드 prerender 포함)에서는 fallback만 그리고, 브라우저에서만 children을 렌더한다.
 * 거의 클라이언트 렌더링 방침이라 useSuspenseQuery가 서버에서 실행되지 않게 막는다.
 * SSR로 전환하는 페이지는 clientOnly={false}로 두고 page.tsx에서 prefetch + HydrationBoundary를 붙인다.
 */
export function PageBoundary({ children, fallback = <PageSkeleton />, clientOnly = true }: PageBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallback={PageErrorFallback}>
          <Suspense clientOnly={clientOnly} fallback={fallback}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
