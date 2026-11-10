---
name: self-review
description: 현재 변경을 .claude/rules 기준으로 읽기 전용 리뷰하고 실제 위험만 심각도 순으로 보고한다.
user-invocable: true
argument-hint: [file-or-ref]
---

# self-review

코드를 수정하지 않고, 이번 diff가 만든 실제 위험만 보고한다. 범위 밖 개선 아이디어는 결함으로 보고하지 않는다. 읽지 않은 규칙을 근거로 단정하지 않고, 확인하지 못한 내용은 추정이라고 표시한다.

1. 범위를 정한다. 인자가 없으면 `git status --short`, `git diff`, `git diff --staged`. ref가 있으면 `git diff <ref>...HEAD`, 파일이면 그 파일.
2. `.claude/rules/code-quality.md`와 변경 파일에 해당하는 규칙만 읽는다(구조면 `architecture.md`, 데이터면 `data-fetching.md`, UI면 `component-guide.md`, 테스트면 `testing.md`).
3. `pnpm lint`와 `pnpm typecheck`를 돌려 기계적으로 잡히는 문제는 결과로 확인하고, 사람이 봐야 하는 문제에 집중한다.
4. 사용자 흐름·런타임 오류 → 레이어·데이터·상태 규칙 → 접근성·반응형 → 테스트 누락 → 검증 공백 순으로 본다.
5. 특히 볼 것: 한 파일에 섞인 책임, 같은 구조 JSX 3회 이상 반복(배열+map 검토), 토큰 대신 hex·임의 px, mutation 뒤 무효화 누락, 서버 데이터를 `useEffect`로 불러옴, 금지된 새 최상위 폴더, 생성 파일 직접 수정, 실제 비동기·빈 상태 처리 누락, `git-workflow.md`의 리뷰 체크리스트.

## 심각도

| 등급       | 기준                                            |
| ---------- | ----------------------------------------------- |
| Critical   | 보안, 데이터 손실, 주요 흐름 중단               |
| Major      | 실제 버그 가능성, 타입 안정성, 접근성 주요 결함 |
| Minor      | 유지보수성, 제한적인 UX·성능, 검증 누락         |
| Suggestion | 선택적 개선                                     |

## 출력

```md
## Findings

- [Major] `파일:줄` — 문제 / 영향 / 권장 수정

## Verdict

Request changes | Comment | Approve

## Verification Notes

- 확인한 것:
- 확인하지 못한 것:
```

판정: Request changes(Critical·Major 1개 이상) / Comment(Minor·Suggestion만) / Approve(없음).

`--broad`로 부르면 유지보수, UX(로딩·에러·빈 상태 누락), 타입(nullable 가드), 테스트 위험, 개발 경험까지 넓혀 본다. 개수를 채우려고 지적하지 않는다.

UI 변경이면 추가로 본다: union 중복 선언, `as const` 튜플과 `Record` + `satisfies`, boolean 여러 개로 variant를 푼 곳, discriminated union이 더 맞는 곳, 반복 UI의 배열 렌더, Figma 컴포넌트 경계와 코드 경계, 상태 따라 색이 바뀌는 아이콘의 `currentColor`.

보내기 전 확인: 변경 파일을 실제로 읽었는가, 모든 항목에 위치가 있는가, 등급이 위험도와 맞는가, 실행하지 않은 검증을 적었는가.

좋은 점 요약은 쓰지 않는다. 빈 등급은 생략한다. 발견 사항이 없으면 "발견된 이슈 없음"과 확인 범위·공백만 쓴다.

## 에이전트 호출

직접 읽고 판단한 뒤, 변경 성격에 맞는 리뷰 에이전트를 서브에이전트로(Claude Code는 Agent 도구, Codex는 같은 이름의 에이전트) **병렬** 호출해 독립 관점을 더한다. 에이전트에는 변경 범위(diff 범위·파일 목록)와 확인할 사용자 결과만 넘기고 내 결론은 넘기지 않는다.

| 변경에 포함된 것                      | 호출할 에이전트                   |
| ------------------------------------- | --------------------------------- |
| 항상                                  | `ganzi-reviewer`                  |
| `src/app/**`, feature 구조, 상태 위치 | `ganzi-architecture-reviewer`     |
| `features/*/api/**`, 쿼리·mutation    | `ganzi-api-contract-reviewer`     |
| 화면·`shared/ui`·스타일               | `ganzi-ui-accessibility-reviewer` |

결과를 합칠 때 같은 지적은 하나로 묶고, 에이전트끼리 판정이 갈리면 근거를 직접 확인해서 정한다. 에이전트가 `BLOCKED`면 빠진 입력을 Verification Notes에 적는다.

변경이 크거나 성격이 섞였으면 `.claude/agents/README.md`의 역할 선택표에 따라 전문 리뷰어 에이전트를 함께 부른다. 화면 확인이 필요해 확정할 수 없는 내용은 검증 공백으로 남긴다. 발견 사항이 없으면 확인 범위와 공백만 보고한다.
