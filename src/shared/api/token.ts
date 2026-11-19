import { getQueryClient } from "@/shared/lib/query-client";

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  getQueryClient().clear();
}

// 서버 JwtProvider가 access token payload의 `role` claim에 역할을 넣음. 서명 검증은 서버 몫
export function getAccessTokenRole(): string | null {
  const payload = getAccessToken()?.split(".")[1];
  if (!payload) return null;

  try {
    const claims: unknown = JSON.parse(window.atob(payload.replaceAll("-", "+").replaceAll("_", "/")));
    if (typeof claims !== "object" || claims === null || !("role" in claims)) return null;
    return typeof claims.role === "string" ? claims.role : null;
  } catch {
    return null;
  }
}
