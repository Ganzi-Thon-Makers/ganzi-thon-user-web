---
name: react-performance
description: Next.js·React 코드의 성능 위험을 카테고리별로 찾아 영향도 순으로 보고하고, 승인 후 측정 근거가 있는 것만 고친다.
user-invocable: true
argument-hint: [file-or-directory]
allowed-tools: Bash, Read, Grep, Glob
---

# react-performance

실제 코드를 읽은 뒤에만 제안한다. 측정 가능한 병목이나 확실한 낭비에만 적용하고, 추측성 최적화는 하지 않는다. 목록을 보고하고 사용자가 고른 것만 고친다.

`.claude/rules/component-guide.md`의 성능 절, `.claude/rules/verification.md`의 번들 측정법을 함께 따른다.

## 작업 흐름

1. 대상 파일·디렉터리를 읽는다.
2. 아래 카테고리 순서로 위반을 찾는다.
3. `### [CRITICAL|HIGH|MEDIUM|LOW] 제목 / 파일:줄 / 문제 / 영향 / 수정안`으로 영향도 순 보고.
4. 승인된 것만 고치고, 번들·렌더 영향은 전후를 측정해 남긴다.
5. 고친 뒤 서브에이전트로(Claude Code는 Agent 도구, Codex는 같은 이름의 에이전트) `ganzi-verifier`를 호출해 검증하고, 동작이 바뀌지 않았는지 `ganzi-reviewer`로 확인한다.

## 측정 도구

코드만 읽어 추정하지 말고, 개발 서버(`pnpm dev`)를 띄울 수 있으면 Chrome DevTools MCP로 잰다(`docs/MCP.md`).

- 리렌더: `react_start_profiling` → 문제 조작 → `react_stop_profiling` → `react_get_trace_overview`·`react_get_commit_report`로 어떤 컴포넌트가 몇 번, 얼마나 오래 렌더됐는지 확인한다. 고친 뒤 같은 조작으로 다시 재서 전후를 비교한다.
- 원인 추적: `react_find_components`로 컴포넌트를 찾고 `react_get_component_by_uid`로 props·hooks를, `react_get_owner_stack`으로 누가 렌더했는지 본다.
- 로딩·LCP: Chrome DevTools MCP의 performance trace로 잰다.
- MCP를 쓸 수 없으면 코드 기준 추정임을 보고에 밝힌다.

## CRITICAL — 경계와 번들

- `'use client'`가 필요 이상 위에 있다. 상호작용이 있는 가장 안쪽으로 내릴 수 있는가? (`'use client'` 파일이 import하는 모듈은 전부 client bundle에 들어간다)
- barrel(`index.ts`) 재수출을 만들지 않는다. 직접 경로로 import한다.
- 초기 화면에 필요 없는 무거운 컴포넌트·라이브러리는 `next/dynamic`(또는 이벤트 시점의 `import()`)으로 늦게 받는다.
- 서드파티 스크립트는 `next/script`의 `strategy="lazyOnload"`나 쓰는 화면에서만 로드한다.

## CRITICAL — 비동기

- 독립적인 요청은 `Promise.all`로 병렬 처리한다. 순차 `await` 폭포를 만들지 않는다.
- 결과가 필요 없는 요청(분석 이벤트)은 기다리지 않는다.
- 독립적인 쿼리는 형제 컴포넌트로 나누거나 `useSuspenseQueries`로 받아 폭포를 피한다.

## HIGH — 리렌더

- 파생 값을 `useEffect` + setState로 만들지 않는다. 렌더 중에 계산한다(`useMemo`는 측정된 비용이 있을 때만).
- 이전 상태에 의존하는 업데이트는 함수형(`setCount((prev) => prev + 1)`).
- 무거운 초기값은 lazy 초기화(`useState(() => compute())`).
- 렌더에 반영하지 않는 잦은 값은 `useRef`.
- 특정 사용자 행동의 부수 효과는 effect가 아니라 이벤트 핸들러에서 실행한다.
- 자주 바뀌는 상태와 무거운 렌더를 분리하고, 그래도 비싸면 그 부분만 `memo`.
- 전역 store는 selector로 필요한 값만 구독한다(`useStore((s) => s.value)`).

## HIGH — 렌더링·이미지

- 보이지 않는 무거운 컴포넌트는 CSS로 숨기지 말고 조건부 렌더링(상태 보존이 필요하면 예외).
- 입력 반응과 무거운 결과 갱신을 `useTransition`으로 분리한다.
- LCP 이미지만 `fetchPriority="high"`(단일 hero면 `preload`), 나머지는 lazy + `sizes`. 폰트는 `next/font`.
- 긴 목록은 `content-visibility: auto`나 가상화를 검토한다(가상화 라이브러리는 먼저 묻는다).

## MEDIUM — JS

- 반복 조회는 배열 `includes` 대신 `Set`/`Map`.
- `filter()[0]` 대신 `find()`. 같은 배열을 여러 번 도는 반복은 합친다.
- 반복 호출되는 함수 안의 정규식·`Intl` 포매터는 모듈 상수로 올린다.

## LOW — 고급

- 최신 콜백을 effect 의존성 없이 읽어야 하면 `useEffectEvent`(React 19).
- StrictMode 중복 초기화 방지 ref는 cleanup에서 되돌린다.

## 하지 않는 것

- 근거 없이 모든 함수에 `useCallback`, 모든 값에 `useMemo` 붙이기
- 측정 없이 "빨라질 것"이라고 보고하기
