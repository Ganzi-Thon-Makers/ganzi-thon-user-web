// 토큰 저장 위치는 백엔드와 방식 확정 전까지 임시로 localStorage를 쓴다.
// httpOnly 쿠키 방식으로 바뀌면 이 파일을 삭제하고 client.ts의 beforeRequest를 제거한다.
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
}
