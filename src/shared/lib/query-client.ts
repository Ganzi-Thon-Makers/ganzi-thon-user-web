import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 팀 기본값. 필요하면 queryOptions에서 덮어쓴다.
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * 서버 렌더마다 새 QueryClient를, 브라우저에서는 하나를 재사용한다.
 * (Next.js 공식 TanStack Query 가이드 패턴. SSR 전환 시 그대로 쓴다.)
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
