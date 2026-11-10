# 구조 규칙

## 폴더와 의존 방향

```text
src/app/                 라우팅 전용 (로직·API 호출·상태 금지)
src/features/<도메인>/   도메인 코드 전부: api/ components/ hooks/ pages/ store.ts types.ts
src/shared/              도메인을 모르는 공용 코드: api/ components/ ui/ lib/ stores/ config/ test/
src/styles/              globals.css (토큰)
```

- 의존 방향은 app → features → shared. feature 간 import, Base UI·ky 직접 import는 oxlint가 막는다. 걸리면 규칙을 끄지 말고 코드 위치를 옮긴다.
- `src/` 최상위에 새 폴더(`components`·`lib`·`hooks`·`services` 등)를 만들지 않는다. `shared/` 하위 폴더를 늘리는 것은 결정 기록 대상이다.
- 빈 폴더나 아직 안 쓰는 `store.ts`·`hooks/`·`types.ts`를 미리 만들지 않는다. `pages/` 아래에 하위 폴더를 만들지 않는다.
- import는 feature 안이면 상대 경로, shared는 `@/shared/...`.

## 새 기능 순서

`types.ts` → `api/<도메인>.api.ts` → `api/<도메인>.queries.ts` → `components/`(+ 테스트) → `pages/<Name>Page.tsx` → `app/(main)/<경로>/page.tsx`에서 `PageBoundary`로 감싸 연결 (`src/app/(main)/page.tsx` 참고)

## 배치

| 무엇                                               | 어디                            |
| -------------------------------------------------- | ------------------------------- |
| 한 화면에서만 쓰는 UI·에셋                         | `features/<도메인>/components/` |
| 여러 feature가 같은 이유로 쓰는 디자인 시스템 요소 | `shared/ui/`                    |
| 여러 feature가 같은 이유로 쓰는 앱 공용 조합       | `shared/components/`            |
| 상호작용 상태                                      | `features/<도메인>/hooks/`      |
| 서버 요청                                          | `features/<도메인>/api/`        |
| URL·metadata·문서 셸                               | `src/app/` 파일 규약            |

- 비슷해 보인다는 이유만으로 `shared`로 올리지 않는다.
- `pages/*Page.tsx`는 쿼리 연결과 조립만 맡는다. 페이지 본문에는 페이지 목적만 보이게 하고, 인증·리다이렉트 같은 제어는 가드 layout이나 훅으로 뺀다.
- 여러 화면이 같은 셸(헤더, 하단 고정 버튼)을 쓰면 `shared/components/PageShell`처럼 slot props(`header`, `footer`)로 만든다.
- Stack 같은 범용 배치 primitive는 같은 구조가 3곳 이상 반복되고 className 한 줄짜리 wrapper가 아닐 때만 만든다.
- 도메인은 의미로 나눈다. 예: 세션 시작·종료는 `features/auth`, 내 프로필(`/me`)은 `features/user`.
- 여러 단계 화면을 가로지르는 값(가입 단계 입력 등)은 URL에 남아도 되면 searchParams, 아니면 sessionStorage에 두고 한 feature 안의 helper로만 읽고 쓴다.

## 렌더링과 App Router

- 거의 클라이언트 렌더링이다. 데이터는 브라우저에서 백엔드로 직접 요청한다.
- `app/**/page.tsx`는 서버 컴포넌트로 두고 `PageBoundary`로 감싼 feature 페이지만 렌더한다.
- `'use client'`는 `features/*/pages/*Page.tsx`와 상호작용이 있는 가장 안쪽 컴포넌트에 둔다. 외부 링크·단순 CSS 전환을 위해 클라이언트 컴포넌트를 만들지 않는다.
- 서버 → 클라이언트로 넘기는 props는 직렬화 가능한 데이터만.
- root `layout.tsx`는 문서·전역 경계(`html`·`body`, metadata, 폰트, Provider)만, route group layout은 화면 뼈대만 맡는다.
- Provider는 앱 전반이 실제로 공유하는 상태·동작만 감싼다.
- 로딩·에러는 `PageBoundary`가 맡는다. `loading.tsx`·`error.tsx`·`not-found.tsx`는 그걸로 안 되는 복구 경로가 필요할 때만 추가한다. 예외(`PageError`)와 없는 경로(not-found)는 문구를 나눈다.
- 아직 구현하지 않은 경로에 빈 `page.tsx`나 "준비 중" 페이지를 만들지 않는다. 컴포넌트 확인용 임시 route도 커밋하지 않는다.
- metadata는 필요해질 때 해당 route에 추가한다.
- 도구가 생성하는 파일(`next-env.d.ts`, `.next/types`)은 고치지 않는다.

## 인증 가드

- 인증을 도입하면 인증 구분은 route group(`app/(auth)`, `app/(main)`)과 그 layout(쿠키 기반이면 `proxy.ts`. Next 16에서 middleware가 proxy로 바뀌었다)이 맡는다. `features/*/pages`는 자신이 보호되는지 모른다.
- 실제 검사가 없는 가드 스텁을 미리 만들지 않는다. 보호된다고 착각하게 만든다.
- 클라이언트 가드는 판정이 끝날 때까지 `PageSkeleton`만 렌더하고 보호된 children을 마운트하지 않는다.
- 인증이 필요한 쿼리는 가드 트리 안에서만 마운트한다. 비로그인 상태에서 전역 훅이 API를 부르면 401 연쇄가 생긴다.

## 이름

- 컴포넌트 파일만 PascalCase (`UserList.tsx`)
- 그 외 파일·폴더는 모두 kebab-case. 훅 파일도 포함 (`use-post-filter.ts` 안에 `usePostFilter`), 역할이 있으면 `<도메인>.<역할>.ts` (`users.queries.ts`)

## 환경변수

- 공개 값(`NEXT_PUBLIC_*`)은 `.env.development`(dev)·`.env.production`(build·start)에 커밋한다. 비밀값만 `.env.local`에 두고, 키 이름은 `.env.example`에 추가한다.
- 코드에서는 `@/shared/config/env`의 `env`로 읽는다.
