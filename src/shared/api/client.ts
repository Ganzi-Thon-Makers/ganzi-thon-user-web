import ky from "ky";

import { env } from "@/shared/config/env";

import { getAccessToken } from "./token";

/**
 * 모든 HTTP 요청은 이 인스턴스로 보낸다. (fetch·ky 직접 사용 금지)
 * 토큰 처리는 이 파일과 token.ts에만 둔다.
 *
 * 토큰 방식이 httpOnly 쿠키로 바뀌면:
 *   1. beforeRequest 훅 제거
 *   2. credentials: "include" 추가
 *   3. token.ts 삭제
 */
export const api = ky.create({
  // prefix는 경로 앞의 슬래시를 정규화해 준다. ("posts", "/posts" 모두 동작)
  prefix: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  retry: 0, // 재시도는 TanStack Query가 담당한다.
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAccessToken();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    // afterResponse: 401 재발급 로직은 토큰 방식 확정 후 추가한다. (ky.retry 사용)
  },
});
