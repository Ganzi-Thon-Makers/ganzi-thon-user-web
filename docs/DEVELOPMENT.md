# 개발 가이드

팀원이 바로 적용할 프로젝트 고유의 기준이다. 기본 명령어와 기술 스택은 [README](../README.md), 파일 위치는 [프로젝트 구조](ARCHITECTURE.md)를 참고한다.

## 환경

- Node.js 22 (`.nvmrc`), pnpm 10 (`packageManager`로 고정, `corepack enable`)
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- `npm`, `yarn`, `npx`는 쓰지 않는다. (`pnpm exec`, `pnpm dlx`)

## 로컬 실행

```bash
nvm use
corepack enable
pnpm install   # lefthook 훅도 함께 설치된다
pnpm dev       # http://localhost:3000
```

## 환경변수

- 공개 값(`NEXT_PUBLIC_*`)은 `.env.development`(dev)·`.env.production`(build·start)에 커밋되어 있어 따로 설정할 필요가 없다.
- 비밀값만 `.env.local`에 두고(커밋 금지), 키 이름은 `.env.example`에 추가한다.
- 코드에서는 `@/shared/config/env`의 `env`로 읽는다. `process.env`를 흩어서 쓰지 않는다.
- CI 빌드용 값은 GitHub 저장소 Settings → Variables에 둔다.

## 라이브러리

익숙하고 팀이 합의한 스택만 쓴다: Next.js, Tailwind CSS, Base UI(+ 디자인), TanStack Query, Suspensive, Zustand, ky, oxlint·oxfmt.

새 라이브러리는 추가하기 전에 팀에 먼저 묻는다. 라이브러리 API는 버전에 따라 다르니 `node_modules`의 README·docs를 먼저 확인한다 (특히 ky 2, Base UI, Next 16).

## 작업 시작 순서

1. 이슈를 만들고 `develop`에서 브랜치를 딴다 ([Git 흐름](GIT_WORKFLOW.md)).
2. 파일 위치는 [프로젝트 구조](ARCHITECTURE.md)를 따르고, 새 기능은 정해진 순서로 만든다.
3. 구현 범위에 맞는 검증을 돌리고, 자동화할 수 없는 화면 확인은 PR에 남긴다.
4. UI 변경 PR에는 전/후 스크린샷을 첨부한다.

## 코드 작성 기준

자주 쓰는 것만 요약했다. 전체 기준은 [`code-style.md`](../.claude/rules/code-style.md), [`code-quality.md`](../.claude/rules/code-quality.md), [`component-guide.md`](../.claude/rules/component-guide.md)에 있다.

- 함수와 컴포넌트는 `function` 선언, named export. `export default`는 `page`·`layout` 같은 Next 파일만.
- 컴포넌트 파일은 PascalCase(`UserList.tsx`), 훅 파일은 훅 이름 그대로(`usePostFilter.ts`), 그 외는 kebab-case 또는 `<도메인>.<역할>.ts`(`users.queries.ts`).
- boolean은 `is`·`has`·`can`·`should`, 이벤트 prop은 `on`, 핸들러는 `handle`로 시작한다.
- className 병합은 `cn()`, 변형은 `cva`, 색·간격은 토큰 클래스만.
- HTTP는 `@/shared/api/client`의 `api`만 쓴다. 쿼리는 `queries.ts`의 `queryOptions` 팩토리로만 정의하고 컴포넌트에 queryKey를 직접 쓰지 않는다.
- 계산할 수 있는 값을 state로 복제하지 않는다. `useEffect`는 외부 시스템 동기화에만 쓴다.
- `any`, `!`(non-null), `console.log`는 lint가 막는다.

## 테스트

- 대상 옆에 `*.test.ts(x)`로 둔다. `pnpm test`는 감시 모드, `pnpm test:run`은 CI와 같은 단발 실행.
- 컴포넌트는 역할·텍스트로 찾는다(`getByRole`). className·구현 세부를 검사하지 않는다.
- 쿼리를 쓰는 컴포넌트는 `renderWithProviders`로 렌더하고 네트워크는 `../api/<도메인>.api`만 `vi.mock`한다(`next/navigation`·브라우저 API는 필요할 때 mock).
- 분기 있는 유틸, 상태 전이, 폼·메뉴 같은 상호작용은 테스트한다. 정적 마크업은 강제하지 않는다.

상세: [`testing.md`](../.claude/rules/testing.md)

## 검증

| 명령            | 하는 일                                           |
| --------------- | ------------------------------------------------- |
| `pnpm format`   | oxfmt 자동 포맷 (import·Tailwind class 정렬 포함) |
| `pnpm check`    | 타입체크 + oxlint + 포맷 검사 (CI와 같음)         |
| `pnpm test:run` | Vitest 단발 실행                                  |
| `pnpm build`    | 프로덕션 빌드. 라우트·설정·env를 바꿨을 때        |

PR 전에는 `pnpm check`와 `pnpm test:run`을 통과시킨다. UI 변경은 명령 통과만으로 끝내지 않고 넓은 화면·좁은 화면에서 직접 확인한다. 실행하지 못한 검증은 PR에 이유와 함께 남긴다.

### 자동으로 도는 것

| 시점      | 도구                    | 내용                                                    |
| --------- | ----------------------- | ------------------------------------------------------- |
| 저장할 때 | VS Code + oxc 확장      | 포맷, oxlint 자동 수정                                  |
| 커밋할 때 | lefthook `pre-commit`   | staged 파일 포맷 → 린트 → 타입체크 → 관련 테스트        |
| 커밋할 때 | lefthook `commit-msg`   | commitlint (Conventional Commits)                       |
| PR·push   | GitHub Actions `ci.yml` | commitlint, `pnpm check`, `pnpm test:run`, `pnpm build` |

훅이 실패하면 원인을 고쳐서 다시 커밋한다. `--no-verify`, `LEFTHOOK=0`으로 건너뛰지 않는다.

## 에디터 설정

- `.editorconfig`: 인코딩·들여쓰기·줄바꿈 기준 (VS Code 외 에디터용)
- `.gitattributes`: Git에 저장되는 텍스트 파일 줄바꿈을 LF로 통일 (Windows 팀원 대비)
- `.vscode/extensions.json`: oxc, Tailwind CSS IntelliSense 권장
- `.vscode/settings.json`: 저장 시 oxfmt 포맷·oxlint 수정, 워크스페이스 TypeScript, `cn`·`cva` 안에서 Tailwind 자동완성
- `.vscode/react.code-snippets`: `frc`(named 컴포넌트), `fpage`(PageBoundary 페이지), `fn`(함수 선언)
