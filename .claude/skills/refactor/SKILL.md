---
name: refactor
description: 동작을 바꾸지 않는 좁은 리팩터링을 분석하고 적용한다.
user-invocable: true
argument-hint: [file-or-scope]
---

# refactor

기본으로 `.claude/rules/code-quality.md`, `.claude/rules/verification.md`를 읽고, UI 구조를 바꿀 때만 `component-guide.md`를 추가로 읽는다.

1. 대상 코드와 테스트를 읽고, 유지할 동작(화면·상호작용·API 호출·쿼리 키)을 짧게 적는다.
2. 후보를 분류한다: 중복, 공통 승격 필요, 의존 방향 위반, 타입(any·단언), 네이밍, 미사용 코드, 성능. `### [우선순위] 제목 / 파일 / 문제 / 개선` 형식으로 목록을 보여주고, 사용자가 고른 것만 적용한다. 이번 범위는 하나로 좁게 정한다.
3. 동작을 바꾸지 않는 명확한 개선만 적용한다. 결과가 달라질 수 있으면 후보로만 보고한다.
4. 새 dependency를 추가하지 않는다. 삭제와 기존 코드 재사용을 새 추상화보다 우선한다. 한 번만 쓰는 helper·wrapper·Provider를 만들지 않는다.
5. 테스트가 없는 로직을 바꿔야 하면 먼저 현재 동작을 고정하는 테스트를 추가할지 판단한다.
6. `pnpm check`, `pnpm test:run`을 돌린다.
7. 동작 보존을 독립 확인한다. 서브에이전트로(Claude Code는 Agent 도구, Codex는 같은 이름의 에이전트) `ganzi-reviewer`(리팩터링 전후 동작이 같은지, "동작 변경 없음" 관점으로 diff 검토)와 `ganzi-verifier`(검증 실행)를 병렬 호출한다. 구조·레이어를 옮겼으면 `ganzi-architecture-reviewer`도 부른다. `NEEDS_REVISION`이면 고치고 다시 확인한다.
8. 아래 형식으로 보고한다.

```md
## 리팩터링 결과

- 변경:
- 유지한 동작:
- 검증:
- 남은 위험:
```
