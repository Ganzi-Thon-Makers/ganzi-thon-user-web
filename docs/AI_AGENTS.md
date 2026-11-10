# AI 에이전트로 작업하기

이 저장소에는 Claude Code와 Codex가 같은 규칙으로 작업하도록 하네스가 들어 있다. 에이전트용 진입점은 [`.claude/README.md`](../.claude/README.md)이고, 이 문서는 사람이 그걸 어떻게 쓰는지 설명한다.

## 구조

```text
CLAUDE.md (= AGENTS.md)     항상 지키는 핵심 원칙. 세션 시작 시 자동 로드
└─ .claude/README.md        작업별로 어떤 규칙을 읽을지 고르는 표
   ├─ rules/                작업별 상세 규칙 (필요한 것만 읽음)
   ├─ agents/               읽기 전용 검증 에이전트
   ├─ skills/               /명령으로 부르는 작업 절차
   ├─ hooks/                도구 실행 전후 자동 검사
   ├─ references/          API 계약, 공용 UI 패턴
   ├─ decisions/            구조·라이브러리 결정 기록
   └─ known-issues/         코드만으로 못 고치는 문제 기록
.codex/
├─ skills → ../.claude/skills  심링크 (스킬 원본 하나를 공유)
├─ agents/                 원본 md를 읽게 하는 TOML 프록시
└─ hooks.json              .claude/hooks 스크립트를 그대로 실행
```

규칙을 한 번에 다 읽히지 않고 작업에 맞는 것만 읽게 해서 컨텍스트를 아낀다.

## 스킬

| 명령                 | 언제                                       |
| -------------------- | ------------------------------------------ |
| `/self-review`       | 커밋·PR 전에 변경 리뷰                     |
| `/commit`            | 커밋 메시지·나누기 제안 (실행은 직접)      |
| `/issue`             | 이슈 폼에 맞춘 이슈 초안 (gh 인증 시 생성) |
| `/pull-request`      | PR 템플릿에 맞춘 제목·본문 초안            |
| `/figma-screen`      | Figma 링크로 화면·컴포넌트 구현            |
| `/scaffold-api`      | 백엔드 명세로 types·api·queries 만들 때    |
| `/gen-test`          | 파일 하나 테스트 작성·실행                 |
| `/react-performance` | 성능 점검 (번들·리렌더·이미지)             |
| `/refactor`          | 동작을 안 바꾸는 좁은 리팩터링             |

## 검증 에이전트

스킬이 끝날 때 맞는 에이전트를 자동으로 부른다: `/self-review`는 변경 성격별 리뷰어를 병렬로, `/refactor`·`/react-performance`는 `ganzi-reviewer`+`ganzi-verifier`, `/scaffold-api`는 `ganzi-api-contract-reviewer`, `/figma-screen`은 `ganzi-ui-accessibility-reviewer`·`ganzi-visual-verifier`.

구현은 메인 세션이 하고, 아래 에이전트는 읽기 전용으로 독립 검토만 한다. 에이전트는 완료 보고 전에 변경에 맞는 검증 에이전트를 최소 한 번 부르도록 되어 있다.

| 에이전트                          | 보는 것                             |
| --------------------------------- | ----------------------------------- |
| `ganzi-reviewer`                  | diff의 실제 회귀 위험               |
| `ganzi-verifier`                  | 변경 범위에 맞는 명령 실행과 증거   |
| `ganzi-architecture-reviewer`     | 라우팅·레이어·데이터·상태 위치 규칙 |
| `ganzi-ui-accessibility-reviewer` | 디자인 충실도·반응형·접근성         |
| `ganzi-api-contract-reviewer`     | 백엔드 계약·쿼리·mutation·에러 처리 |
| `ganzi-visual-verifier`           | Figma와 실제 렌더 화면 비교         |
| `ganzi-debugger`                  | 버그 재현과 근본 원인               |

결과는 `PASS` / `NEEDS_REVISION` / `BLOCKED`로 나온다. `BLOCKED`는 Figma 링크·화면·재현 절차 같은 입력이 부족하다는 뜻이니 그 입력을 주면 된다.

## 훅

| 훅                  | 시점             | 하는 일                                                                            |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `guard-rules.mjs`   | 명령·편집 전     | pnpm 외 패키지 매니저, 커밋 훅 우회, lint 끄는 주석, `tailwind.config.*` 생성 차단 |
| `lint-check.mjs`    | TS/TSX 편집 직후 | 그 파일만 oxlint로 검사해 에이전트에게 결과를 돌려줌                               |
| `skill-suggest.mjs` | 프롬프트 제출 시 | 키워드에 맞는 스킬 안내                                                            |

훅은 빠른 피드백일 뿐이고, 최종 검증은 lefthook·CI가 한다.

## 요청 잘하는 법

- Figma 작업은 frame·layer의 **Copy link to selection** URL을 같이 준다.
- API 연동은 백엔드 명세(Swagger 링크나 응답 예시)를 같이 준다. 없으면 에이전트는 엔드포인트를 추측하지 않고 멈춘다.
- 버그는 재현 절차, 기대 결과, 실제 결과를 적는다.

## 규칙을 바꾸고 싶을 때

- 팀이 합의한 규칙은 `.claude/rules/`의 해당 파일을 고친다. 같은 내용을 다른 파일에 복사하지 않는다.
- 여러 기능에 영향을 주는 구조·라이브러리 결정은 `.claude/decisions/`에 기록한다.
- 개인 설정은 `.claude/settings.local.json`에 둔다 (커밋되지 않음).
