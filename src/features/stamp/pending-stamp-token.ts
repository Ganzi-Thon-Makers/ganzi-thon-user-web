// 로그인하지 않은 채 QR로 들어오면 로그인 화면을 거치는 동안 토큰을 잠깐 보관. 탭을 닫으면 사라짐
const PENDING_STAMP_TOKEN_KEY = "pendingStampToken";

export function readPendingStampToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(PENDING_STAMP_TOKEN_KEY);
}

export function savePendingStampToken(token: string): void {
  window.sessionStorage.setItem(PENDING_STAMP_TOKEN_KEY, token);
}

export function clearPendingStampToken(): void {
  window.sessionStorage.removeItem(PENDING_STAMP_TOKEN_KEY);
}
