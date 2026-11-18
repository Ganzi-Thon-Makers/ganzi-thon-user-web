import ky, { isHTTPError } from "ky";

import { env } from "@/shared/config/env";

import { clearAccessToken, getAccessToken, setAccessToken } from "./token";
import type { ApiResponse } from "./types";

interface RefreshAttempt {
  authorization: string | null;
  result: Promise<string | null>;
  accessToken?: string;
}

let refreshAttempt: RefreshAttempt | undefined;

export const localApi = ky.create({
  timeout: 15_000,
  retry: 0, // 재시도는 TanStack Query가 담당한다.
});

export const backendApi = localApi.extend({
  prefix: env.NEXT_PUBLIC_API_URL,
});

export async function refresh() {
  const url = new URL("/api/auth/refresh", window.location.origin);
  const { data } = await localApi.post(url).json<ApiResponse<{ accessToken: string }>>();
  return data;
}

async function getRefreshedToken(authorization: string | null) {
  const previousToken = getAccessToken();

  // 늦게 도착한 401 응답도 같은 재발급 결과를 쓴다.
  if (
    refreshAttempt?.authorization === authorization &&
    (!refreshAttempt.accessToken || refreshAttempt.accessToken === previousToken)
  ) {
    return refreshAttempt.result;
  }

  const previousAuthorization = previousToken ? `Bearer ${previousToken}` : null;
  if (authorization !== previousAuthorization) return null;

  const result = refresh()
    .then(({ accessToken }) => {
      if (getAccessToken() !== previousToken) return null;
      setAccessToken(accessToken);
      return accessToken;
    })
    .catch((error: unknown) => {
      const refreshRejected = isHTTPError(error) && error.response.status === 401;
      if (!refreshRejected) throw error;

      if (getAccessToken() === previousToken) {
        clearAccessToken();
        window.location.replace("/");
      }
      return null;
    });
  const attempt: RefreshAttempt = { authorization, result };
  refreshAttempt = attempt;

  try {
    const token = await result;
    if (token) attempt.accessToken = token;
    return token;
  } finally {
    if (!attempt.accessToken && refreshAttempt === attempt) refreshAttempt = undefined;
  }
}

export const api = backendApi.extend({
  retry: { limit: 1, methods: [] },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAccessToken();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || retryCount > 0 || typeof window === "undefined") return;

        const token = await getRefreshedToken(request.headers.get("Authorization"));
        if (!token || getAccessToken() !== token) return;

        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${token}`);
        return ky.retry({ request: new Request(request, { headers }), delay: 0 });
      },
    ],
  },
});
