import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense, type ReactElement } from "react";

/** 테스트마다 새 QueryClient를 만든다. (캐시 공유·재시도 방지) */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
}

/**
 * QueryClientProvider + Suspense로 감싸서 렌더한다.
 * useSuspenseQuery를 쓰는 컴포넌트는 findBy*로 결과를 기다린다.
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const queryClient = createTestQueryClient();
  const user = userEvent.setup();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>loading</p>}>{ui}</Suspense>
    </QueryClientProvider>,
    options,
  );

  return { ...result, user, queryClient };
}
