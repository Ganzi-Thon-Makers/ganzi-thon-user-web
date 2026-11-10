# Claude 작업 안내

AI 에이전트가 작업 전에 읽을 문서와 로딩 기준이다. `CLAUDE.md`(= `AGENTS.md`)는 항상 지키는 핵심 원칙만 담은 부트로더이고, 상세 규칙은 이 문서의 표를 따라 `.claude/rules/`에서 필요한 것만 읽는다.

## 읽기 순서

1. `CLAUDE.md`
2. 이 문서
3. 작업에 맞는 규칙만 아래 표에서 골라 읽는다. 관련 없는 문서를 한꺼번에 읽지 않는다.

단순 질문은 `CLAUDE.md`와 이 문서만으로 답한다.

## 작업별 규칙

| 작업                                                            | 읽을 문서                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| 프로젝트 변경 전반 (항상)                                       | `.claude/rules/project-constraints.md`, `.claude/rules/workflow.md` |
| 코드 구현·수정·리팩터링·리뷰                                    | `.claude/rules/code-quality.md`, `.claude/rules/verification.md`    |
| 파일 배치, 라우트 추가, Server/Client 판단, env                 | `.claude/rules/architecture.md`                                     |
| API 연동, 쿼리, 상태 관리                                       | `.claude/rules/data-fetching.md`                                    |
| 화면·컴포넌트 UI, 스타일, Base UI 래핑, 접근성·반응형·모션·성능 | `.claude/rules/component-guide.md`                                  |
| 네이밍, 타입, 함수·export 형태, JSX 판단                        | `.claude/rules/code-style.md`                                       |
| Figma와 실제 화면 비교                                          | `.claude/rules/visual-verification.md`                              |
| Git 커밋·PR, 브랜치                                             | `.claude/rules/git-workflow.md`                                     |
| 테스트 작성                                                     | `.claude/rules/testing.md`                                          |
| 설정·CI·훅·자동화 변경                                          | `.claude/rules/verification.md`, 관련 `.github/`·`lefthook.yml`     |
| 검증만 수행                                                     | `.claude/rules/verification.md`                                     |
| 구조·라이브러리·공통 규칙 결정                                  | `.claude/decisions/README.md`                                       |
| 백엔드 API 계약 확인·기록                                       | `.claude/references/api/README.md`, 해당 도메인 파일                |
| 공용 UI 사용 시점                                               | `.claude/references/component-patterns.md`                          |
| 인증·토큰·외부 링크·업로드·헤더                                 | `.claude/rules/security.md`                                         |
| 코드만으로 못 닫는 외부 문제                                    | `.claude/known-issues/README.md`                                    |

새 기능 하나를 처음부터 만들면 보통 architecture → data-fetching → component-guide → testing 순으로 다 필요하다.

## Project Agents

구현은 메인 세션이 맡고, 아래 에이전트는 조사·검토·검증만 한다. 변경이 아래 용도에 해당하면 메인 세션은 완료를 보고하기 전에 해당 에이전트를 최소 한 번 호출한다. 사용자가 결과를 실시간으로 확인해준 것은 이 호출을 대체하지 않는다. 선택·입력·종료 기준은 `.claude/agents/README.md`가 단일 기준이다.

| 역할             | 파일                                                | 용도                                     |
| ---------------- | --------------------------------------------------- | ---------------------------------------- |
| 디버거           | `.claude/agents/ganzi-debugger.md`                  | 버그의 근본 원인 조사                    |
| 코드 리뷰어      | `.claude/agents/ganzi-reviewer.md`                  | diff의 실제 회귀 위험 검토               |
| 검증기           | `.claude/agents/ganzi-verifier.md`                  | 변경 범위에 맞는 검증 실행               |
| 구조 리뷰어      | `.claude/agents/ganzi-architecture-reviewer.md`     | 라우팅·레이어·데이터 흐름 규칙 검토      |
| UI 접근성 리뷰어 | `.claude/agents/ganzi-ui-accessibility-reviewer.md` | 디자인 충실도·반응형·접근성 검토         |
| API 계약 리뷰어  | `.claude/agents/ganzi-api-contract-reviewer.md`     | 백엔드 계약·쿼리·mutation·에러 처리 검토 |
| 시각 검증기      | `.claude/agents/ganzi-visual-verifier.md`           | Figma와 실제 렌더 결과의 독립 비교       |

Codex 에이전트는 형식(TOML)이 달라 심링크할 수 없어서, `.codex/agents/<name>.toml`이 원본 md를 읽으라고 지시하는 프록시로 둔다. 에이전트를 추가하면 프록시도 같이 만든다.

## Skills

| Skill                | 용도                                        |
| -------------------- | ------------------------------------------- |
| `/self-review`       | 프로젝트 규칙 기준의 읽기 전용 코드 리뷰    |
| `/commit`            | Conventional Commit 메시지·명령 제안        |
| `/issue`             | 이슈 폼(task.yml)에 맞춘 이슈 초안          |
| `/pr`                | PR 템플릿에 맞춘 제목·본문 초안             |
| `/figma-screen`      | Figma 디자인을 feature 화면·컴포넌트로 구현 |
| `/scaffold-api`      | 명세 기반 types·api·queries 생성            |
| `/gen-test`          | 대상 파일 테스트 작성·실행                  |
| `/react-performance` | 성능 위험 점검·영향도 순 보고               |
| `/refactor`          | 동작 변경 없는 좁은 리팩터링                |

원본은 `.claude/skills/<skill>/SKILL.md` 하나다. `.codex/skills`는 `.claude/skills`를 가리키는 심링크라 Codex도 같은 파일을 읽는다(`AGENTS.md` → `CLAUDE.md`와 같은 방식). 스킬을 추가·수정할 때 Codex 쪽은 손대지 않는다.

## Hooks

Claude Code(`.claude/settings.json`)와 Codex(`.codex/hooks.json`)가 같은 스크립트를 쓴다.

- `guard-rules.mjs`: ① `npm`/`yarn`/`npx`/`bun` 명령 ② 커밋 훅 우회(`--no-verify`, `-n`, `LEFTHOOK=0`, `core.hooksPath`) ③ TS/JS 파일에 `oxlint-disable`·`eslint-disable` 추가 ④ `tailwind.config.*` 생성을 차단한다. heredoc 본문과 따옴표 안 문자열은 검사하지 않는다. (`any`·`console.log`는 oxlint가 잡는다)
- `lint-check.mjs`: TS/TSX 편집 뒤 그 파일 하나에 `oxlint`를 돌리고, 실패하면 결과를 에이전트에게 돌려준다. 편집을 되돌리지 않으므로 완료 검증을 대신하지 않는다.
- `skill-suggest.mjs`: 프롬프트 키워드에 맞는 로컬 스킬을 안내한다.

커밋 시 검사는 `lefthook.yml`(포맷 → 린트 → 타입체크 → 관련 테스트, commitlint)이 맡는다.

## 문서 유지 원칙

- `CLAUDE.md`는 항상 적용되는 핵심 원칙, 이 문서는 로딩 경로, `rules/`는 작업별 상세 규칙을 맡는다. 같은 내용을 두 곳에 쓰지 않는다.
- 코드·설정이 바뀌어 문서의 경로·명령이 달라지면 같은 변경에서 문서도 고친다.
- 문서에는 지금 존재하는 명령·디렉터리·자동화만 쓴다.
