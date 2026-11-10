# 프로젝트 구조

간지톤 사용자 웹은 Next.js App Router 위에서 **거의 클라이언트 렌더링**으로 동작한다. 데이터는 브라우저에서 백엔드로 직접 요청하고, 도메인 코드는 `features/` 단위로 모은다. AI 에이전트도 파일 위치를 바로 추론할 수 있도록 구조를 단순하고 예측 가능하게 유지한다.

상세 조항: [`.claude/rules/architecture.md`](../.claude/rules/architecture.md), [`data-fetching.md`](../.claude/rules/data-fetching.md)

## 디렉터리

```text
src/
├── app/                        # 라우팅 전용 (로직·API 호출·상태 금지)
│   ├── layout.tsx              # html·body, 전역 metadata·폰트, Providers
│   ├── providers.tsx           # QueryClientProvider 등 앱 전역 Provider
│   └── (main)/
│       ├── layout.tsx          # 화면 뼈대
│       └── page.tsx            # PageBoundary로 feature 페이지를 감싸 렌더
├── features/
│   └── <도메인>/
│       ├── types.ts            # 도메인 타입
│       ├── api/
│       │   ├── <도메인>.api.ts     # HTTP 호출 (React 모름)
│       │   └── <도메인>.queries.ts # queryOptions 팩토리
│       ├── components/         # 이 도메인 화면 전용 컴포넌트 (+ 테스트)
│       ├── hooks/              # 이 도메인 전용 훅
│       ├── pages/<Name>Page.tsx  # 'use client' 화면 진입점
│       └── store.ts            # 여러 컴포넌트가 함께 쓰는 UI 상태 (Zustand)
├── shared/                     # 도메인을 모르는 공용 코드
│   ├── api/                    # ky 인스턴스(client), 토큰, toApiError
│   ├── components/             # PageBoundary, PageError, PageSkeleton
│   ├── ui/                     # 디자인 시스템 (Base UI 래핑 + cva)
│   ├── lib/                    # cn, query-client
│   ├── stores/                 # 앱 전역 UI 상태
│   ├── config/env.ts           # 환경변수 접근
│   └── test/render.tsx         # renderWithProviders
└── styles/globals.css          # Tailwind v4 토큰 (색·타이포)
```

## 의존 방향

```text
app  →  features  →  shared
```

- `shared`는 `features`·`app`을 모른다.
- feature끼리는 서로 import하지 않는다. 둘 이상이 필요하면 `shared`로 올린다.
- `ky`, `@base-ui/react`는 직접 import하지 않고 `shared/api`, `shared/ui`를 거친다.

위 규칙은 `oxlint`가 강제하므로 어기면 커밋·CI에서 막힌다. lint 규칙을 끄지 말고 코드 위치를 옮긴다.

## 새 기능 만드는 순서

```text
types.ts → api/<도메인>.api.ts → api/<도메인>.queries.ts → components/ (+ 테스트) → pages/<Name>Page.tsx → app/(main)/<경로>/page.tsx
```

`page.tsx`는 이 형태로만 둔다 (`src/app/(main)/page.tsx` 참고).

```tsx
import { HomePage } from "@/features/home/pages/HomePage";
import { PageBoundary } from "@/shared/components/PageBoundary";

export default function Page() {
  return (
    <PageBoundary>
      <HomePage />
    </PageBoundary>
  );
}
```

VS Code에서 `fpage` 스니펫으로 이 틀을 만들 수 있다.

## 로딩과 에러

`PageBoundary`는 Suspense + ErrorBoundary + `QueryErrorResetBoundary`를 묶은 페이지 기본 경계다.

- 조회는 `useSuspenseQuery`를 쓰고, 로딩은 `PageSkeleton`, 에러는 `PageError`(다시 시도 버튼)가 처리한다. 컴포넌트에서 `isLoading` 분기를 직접 만들지 않는다.
- 기본값 `clientOnly`로 서버에서는 fallback만 그린다. SSR이 필요한 페이지만 `clientOnly={false}`로 두고 `page.tsx`에서 prefetch + `HydrationBoundary`를 붙인다.
- 에러는 `toApiError()`로 변환해서 다룬다. 사용자 문구는 프론트에서 정한다(결정 001).

## 상태는 어디에

| 상태                              | 위치                                   |
| --------------------------------- | -------------------------------------- |
| 서버 데이터                       | TanStack Query                         |
| URL로 공유돼야 하는 값 (필터, 탭) | searchParams                           |
| 여러 컴포넌트가 함께 쓰는 UI 상태 | Zustand (`features/<도메인>/store.ts`) |
| 앱 전역 UI 상태                   | Zustand (`shared/stores/`)             |

서버 데이터를 Zustand에 복사하지 않는다.

## 컴포넌트 경계

- 한 화면에서만 쓰면 `features/<도메인>/components/`, 여러 feature가 같은 이유로 바뀌면 `shared/`로 올린다. 비슷해 보인다는 이유만으로 공용화하지 않는다.
- 디자인 시스템 컴포넌트(버튼, 입력, 다이얼로그 등)는 `shared/ui`에 Base UI를 래핑하고 `cva` variant로 만든다 (`shared/ui/Button.tsx` 참고).
- 색·간격·타이포는 `globals.css` 토큰 클래스만 쓴다.

UI 상세 기준: [`.claude/rules/component-guide.md`](../.claude/rules/component-guide.md)
