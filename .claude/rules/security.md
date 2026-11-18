# 보안 규칙

인증, 외부 링크, 파일 업로드, 헤더, 토큰을 다룰 때 읽는다.

- URL 쿼리로 받은 토큰·코드는 읽은 즉시 `router.replace`로 URL에서 지운다(history에 남기지 않음).
- 새 창은 `window.open(url, "_blank", "noopener,noreferrer")`, 링크는 `rel="noopener noreferrer"`.
- 파일 업로드는 MIME 허용 목록(jpeg·png·webp 등)과 크기 제한을 두고 SVG는 거부한다.
- 보안 헤더(HSTS, X-Content-Type-Options, X-Frame-Options 또는 CSP frame-ancestors, Referrer-Policy)는 `next.config.ts`의 `headers()`로 둔다.
- 외부 SDK·스크립트 URL은 `https://`로 고정한다.
- 토큰은 access token을 메모리에, refresh token을 httpOnly 쿠키에 두는 방식을 기본 후보로 본다. localStorage·sessionStorage 보관은 XSS 노출을 늘린다. 현재 `shared/api/token.ts`는 임시로 localStorage를 쓰므로, 백엔드와 방식을 정할 때 결정 기록으로 남긴다.
- 비밀값은 `NEXT_PUBLIC_`을 붙이지 않는다. 붙이면 클라이언트 번들에 들어간다.
- `dangerouslySetInnerHTML`은 신뢰할 수 있는 출처의 정제된 HTML에만 쓴다.
