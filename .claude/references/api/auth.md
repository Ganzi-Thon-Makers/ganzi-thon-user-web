# 인증 API

사용자 웹 로그인·토큰 재발급·로그아웃. 명세 확인일 2026-11-18.

| Method | Path                   | Operation   | Request                    |
| ------ | ---------------------- | ----------- | -------------------------- |
| POST   | `/api/v1/auth/login`   | `login_1`   | JSON `loginId`, `password` |
| POST   | `/api/v1/auth/refresh` | `refresh_1` | JSON `refreshToken`        |
| POST   | `/api/v1/auth/logout`  | `logout_1`  | Bearer 인증, 본문 없음     |

- 로그인과 재발급은 Bearer 인증 없이 보낸다. 백엔드 성공 응답의 `data`에 `accessToken`, `refreshToken`, `role`이 담긴다. 재발급은 두 토큰을 교체한다.
- 입력 검증은 400, 로그인 거부와 무효 재발급 토큰은 401이다. 에러 응답은 `message`와 선택적인 필드 오류 목록 `errors`를 담는다.
- Next.js의 `/api/auth/login`, `/api/auth/refresh`는 refresh token을 HttpOnly 쿠키에 저장하고 `data.accessToken`을 반환한다.
- 브라우저 API 요청이 HTTP 401을 반환하면 저장된 access token의 유무와 관계없이 재발급을 시도한다. 성공하면 새 토큰으로 원래 요청을 한 번 재시도하고, 재발급 API가 401을 반환하면 토큰을 정리하고 로그인 화면으로 이동한다.
- 로그아웃은 현재 세션을 종료하고 `200`과 성공 메시지를 반환한다. 인증되지 않았거나 access token이 만료됐거나 세션이 종료된 경우 `401`을 반환한다.
- Next.js의 `/api/auth/logout`은 Bearer 헤더를 중계하고, 성공하면 `/api/auth` 경로의 refresh token 쿠키를 만료하고 `204`를 반환한다.
