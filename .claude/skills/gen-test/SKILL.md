---
name: gen-test
description: 대상 파일(컴포넌트·훅·api 함수·유틸)을 분석해 이 프로젝트 테스트 규칙에 맞는 Vitest 테스트를 만들고 실행한다.
user-invocable: true
argument-hint: <file-path>
---

# gen-test

`.claude/rules/testing.md`, `.claude/rules/code-quality.md`, `.claude/rules/verification.md`를 읽는다.

## 1. 대상 분석

| 대상     | 볼 것                                  |
| -------- | -------------------------------------- |
| 컴포넌트 | props, 렌더 분기, 상호작용, 접근성     |
| 훅       | 상태 전이, 파라미터, 부수효과          |
| api 함수 | 요청 파라미터, raw → 도메인 매핑, 에러 |
| 유틸     | 입출력, 경계값                         |

정적 마크업뿐이면 테스트를 강제하지 않고 그렇게 보고한다.

## 2. 방식

- 컴포넌트: render → `userEvent` → 사용자에게 보이는 결과
- 쿼리를 쓰는 컴포넌트: `@/shared/test/render`의 `renderWithProviders` + 네트워크는 `vi.mock("../api/<도메인>.api")`만(라우터·브라우저 API는 필요할 때 mock). 성공·에러(`PageError`) 렌더를 확인한다
- 훅: `renderHook` + `act`
- 유틸: 입력 → 출력

## 3. 작성

- 꼭 볼 것: 렌더 성공, props·variant 동작, 상호작용 결과, 접근성 속성, 빈 데이터·에러·로딩.

- 대상 옆에 `*.test.ts(x)`로 둔다.
- 쿼리 우선순위 `getByRole` → `getByLabelText` → `getByText` → `getByTestId`. 비동기는 `findBy*`·`waitFor`.
- `it()` 하나에 동작 하나. className·내부 구조를 검사하지 않는다.
- `vi.fn`에는 타입 파라미터(`vi.fn<() => void>()`). fake timer·mock은 테스트 뒤 복구한다.
- `.only`·`.skip`·`todo`를 남기지 않는다.

## 4. 실행

`pnpm exec vitest run <테스트 파일>`로 좁게 돌린다. 실패하면 테스트와 코드 중 틀린 쪽을 판단해서 고치고, 코드 버그로 보이면 고치기 전에 보고한다. 마지막에 `pnpm test:run`과 `pnpm check`. 테스트가 구현 세부가 아니라 사용자 계약을 검증하는지 `ganzi-reviewer` 에이전트에 확인받는다.
