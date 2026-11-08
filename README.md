# FE Boilerplate

Next.js 16 · TailwindCSS 4 · Base UI · cva · TanStack Query · Zustand · Suspensive · ky · Vitest · oxlint · oxfmt

## 시작하기

```bash
nvm use            # Node 22
corepack enable    # package.json의 packageManager(pnpm) 사용
pnpm install
pnpm dev
```

http://localhost:3000 에서 홈 화면을 확인합니다. 공개 환경변수는 `.env.development`(개발)·`.env.production`(빌드)에 커밋되어 있고, 비밀값만 `.env.local`에 둡니다. (`.env.example` 참고)

## 스크립트

| 명령                | 설명                                |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | 개발 서버                           |
| `pnpm build`        | 프로덕션 빌드                       |
| `pnpm test`         | Vitest (watch)                      |
| `pnpm test:run`     | Vitest 1회 실행                     |
| `pnpm typecheck`    | 라우트 타입 생성 + tsc              |
| `pnpm lint`         | oxlint (레이어 의존 규칙 포함)      |
| `pnpm lint:fix`     | oxlint 자동 수정                    |
| `pnpm format`       | oxfmt (import·Tailwind 클래스 정렬) |
| `pnpm format:check` | 포맷 검사                           |
| `pnpm check`        | typecheck + lint + format:check     |

## 커밋·CI

- **커밋 메시지**: Conventional Commits — `feat(posts): 게시글 목록 필터 추가` (규칙: `commitlint.config.mjs`)
- **pre-commit (lefthook)**: `pnpm install` 시 자동 설치. staged 파일 포맷 자동 수정 → oxlint → 타입체크 → 관련 테스트
- **commit-msg (lefthook)**: commitlint로 메시지 검사
- **GitHub Actions** (`.github/workflows/ci.yml`): PR마다 commitlint, PR·main push마다 check → test → build. 실제 API 주소는 저장소 Settings → Variables에 `NEXT_PUBLIC_API_URL`로 등록
- **PR 템플릿**: `.github/pull_request_template.md`

## 테스트

테스트는 대상 파일 옆에 `*.test.ts(x)`로 둡니다. 쿼리를 쓰는 컴포넌트는 `renderWithProviders`(`src/shared/test/render.tsx`)로 렌더하고 API 함수만 mock합니다.

## 구조

```
src/
├─ app/                  # 라우팅 전용. page.tsx는 서버 컴포넌트
│  ├─ layout.tsx
│  ├─ providers.tsx      # QueryClientProvider
│  └─ (main)/page.tsx    # 홈 (/)
├─ features/
│  └─ <도메인>/
│     ├─ api/            # <도메인>.api.ts, <도메인>.queries.ts (queryOptions)
│     ├─ components/
│     ├─ pages/          # <Name>Page.tsx ('use client')
│     └─ types.ts
├─ shared/
│  ├─ api/               # ky 인스턴스, 토큰, 에러 정규화
│  ├─ ui/                # Base UI 래핑 컴포넌트
│  ├─ components/        # PageBoundary, PageError, PageSkeleton
│  ├─ lib/               # cn, getQueryClient
│  ├─ stores/            # 전역 UI 상태 (Zustand)
│  └─ config/            # env
└─ styles/globals.css    # Tailwind + 디자인 토큰
```

의존 방향은 `app → features → shared`이며 oxlint로 강제됩니다. 자세한 규칙은 [CLAUDE.md](./CLAUDE.md)를 참고하세요. (`AGENTS.md`는 CLAUDE.md의 심볼릭 링크)

## 백엔드와 확정 후 바꿀 곳

| 항목                   | 바꿀 파일                                                       |
| ---------------------- | --------------------------------------------------------------- |
| 토큰 방식 (쿠키 전환)  | `shared/api/client.ts`, `shared/api/token.ts` 삭제              |
| 에러 응답 형식         | `shared/api/error.ts`의 `ErrorBody`                             |
| OpenAPI 타입 생성      | `features/*/types.ts`에서 생성 타입 재export                    |
| SSR 전환 (페이지 단위) | 해당 `page.tsx`에 prefetch + HydrationBoundary, clientOnly 해제 |
