<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 프로젝트 규칙

라이브러리 API는 학습 데이터와 다를 수 있다. 특히 ky 2(`prefix`/`baseUrl`, 훅 인자 `{ request }`), Base UI(`@base-ui/react`)는 node_modules의 README·docs를 먼저 확인한다.

## 렌더링 방침

- 거의 클라이언트 렌더링. 데이터는 브라우저에서 백엔드로 직접 요청한다.
- `app/**/page.tsx`는 서버 컴포넌트로 두고, `PageBoundary`로 감싼 feature 페이지만 렌더한다.
- `'use client'`는 `features/*/pages/*Page.tsx`와 상호작용 컴포넌트에 둔다.

## 폴더 규칙

- `src/app/`: 라우팅 전용. 비즈니스 로직·API 호출·상태를 두지 않는다.
- `src/features/<도메인>/`: 도메인 코드는 전부 여기. `api/`, `components/`, `hooks/`, `pages/`, `store.ts`, `types.ts`
- `src/shared/`: 도메인을 모르는 공용 코드.
- 의존 방향(app → features → shared), feature 간 import 금지, Base UI·ky 직접 import 금지는 oxlint가 강제한다.
- 새 기능 순서: `types.ts` → `api/<도메인>.api.ts` → `api/<도메인>.queries.ts` → `components/`(+ 테스트) → `pages/<Name>Page.tsx` → `app/(main)/<경로>/page.tsx`에서 `PageBoundary`로 감싸 연결 (`src/app/(main)/page.tsx` 참고)

## 데이터

- HTTP는 `@/shared/api/client`의 `api`만 쓴다. `fetch`도 직접 쓰지 않는다.
- 토큰 처리는 `shared/api/client.ts`, `shared/api/token.ts`에만 둔다.
- API 함수(`<도메인>.api.ts`)는 데이터만 반환하고 React를 모른다.
- 쿼리는 `<도메인>.queries.ts`의 `queryOptions` 팩토리로만 정의한다. 컴포넌트에 queryKey를 직접 쓰지 않는다.

  ```ts
  export const userQueries = {
    all: () => ["users"] as const, // 무효화: invalidateQueries({ queryKey: userQueries.all() })
    list: (params: UserListParams = {}) =>
      queryOptions({ queryKey: [...userQueries.all(), "list", params], queryFn: () => getUsers(params) }),
  };
  ```

- 조회는 `useSuspenseQuery`가 기본이다. 독립적인 쿼리는 형제 컴포넌트로 나누거나 `useSuspenseQueries`를 쓴다.
- 에러 메시지는 `toApiError()`로 변환해서 보여준다.
- 서버 데이터를 Zustand에 복사하지 않는다.

## 상태

| 상태                              | 위치                                   |
| --------------------------------- | -------------------------------------- |
| 서버 데이터                       | TanStack Query                         |
| URL로 공유돼야 하는 값 (필터, 탭) | searchParams                           |
| 여러 컴포넌트가 함께 쓰는 UI 상태 | Zustand (`features/<도메인>/store.ts`) |
| 앱 전역 UI 상태                   | Zustand (`shared/stores/`)             |

## UI

- className 병합은 `cn()`을 쓴다.
- variant·size 같은 변형은 `cva`로 정의하고 `VariantProps`로 props 타입을 만든다. (예: `shared/ui/Button.tsx`)
- 색·간격은 `src/styles/globals.css`의 토큰 클래스(`bg-primary`, `text-muted-foreground` 등)만 쓴다. 임의 값(`bg-[#123456]`)은 피한다.

## 이름 규칙

- 컴포넌트 파일: PascalCase (`UserList.tsx`)
- 그 외 파일·폴더: kebab-case 또는 `<도메인>.<역할>.ts` (`users.queries.ts`)

## 환경변수

- 공개 값(`NEXT_PUBLIC_*`)은 `.env.development`(next dev)·`.env.production`(next build·start)에 커밋한다. 비밀값만 `.env.local`에 두고, 키 이름은 `.env.example`에 추가한다.
- 코드에서는 `@/shared/config/env`의 `env`로 읽는다.

## 테스트

- 테스트 파일은 대상 옆에 `*.test.ts(x)`로 둔다.
- 컴포넌트는 역할·텍스트로 찾는다 (`getByRole`, `findByText`). className·구현 세부를 검사하지 않는다. (variant 확인 정도는 예외)
- 쿼리를 쓰는 컴포넌트는 `@/shared/test/render`의 `renderWithProviders`로 렌더하고, `../api/<도메인>.api`만 `vi.mock`한다.
- `vi.fn`에는 타입 파라미터를 준다. (`vi.fn<() => void>()`)

## AI 작업 규칙

- 파일을 고친 뒤에는 `pnpm format`을 돌린다.
- 작업을 끝냈다고 말하기 전에 `pnpm check`와 `pnpm test:run`을 통과시킨다. 라우트·설정을 바꿨다면 `pnpm build`도 돌린다.
- lint 에러를 규칙 끄기(`oxlint-disable`)로 피하지 않는다. 레이어 규칙에 걸리면 코드 위치를 옮긴다.
- 의존성은 pnpm으로만 추가한다. 새 라이브러리는 추가하기 전에 사람에게 먼저 묻는다.

## 커밋

- 메시지는 Conventional Commits, 제목은 한글로 쓴다. 예) `feat(posts): 게시글 목록 필터 추가`
- 훅이 실패하면 원인을 고치고 다시 커밋한다. `LEFTHOOK=0`이나 `--no-verify`로 건너뛰지 않는다.
