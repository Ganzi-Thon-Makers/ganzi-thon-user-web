# 문서 안내

이 폴더는 프로젝트에 참여하는 사람이 구조와 작업 방식을 빠르게 파악하기 위한 문서다. AI 에이전트용 상세 규칙은 [`.claude/`](../.claude/README.md)에 있다.

| 문서                               | 확인할 때                                                     |
| ---------------------------------- | ------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 파일을 어디에 둘지, 새 기능을 어떤 순서로 만들지 판단할 때    |
| [DEVELOPMENT.md](DEVELOPMENT.md)   | 로컬 실행, 코드 작성 기준, 검증 명령, 에디터 설정을 확인할 때 |
| [GIT_WORKFLOW.md](GIT_WORKFLOW.md) | 브랜치, 커밋, PR, 병합 흐름을 확인할 때                       |
| [AI_AGENTS.md](AI_AGENTS.md)       | Claude Code·Codex로 작업할 때 스킬·검증 에이전트·훅을 쓸 때   |
| [MCP.md](MCP.md)                   | Figma 등 MCP 서버를 연결하고 디자인 URL을 넘길 때             |

문서 내용이 실제 설정과 충돌하면 `package.json`, `tsconfig.json`, `.oxlintrc.json`, `lefthook.yml`, `.github/workflows/`, 그리고 현재 코드가 우선이다. 설정이나 구조를 바꾸면 문서도 같은 PR에서 함께 고친다.

## 문서 역할 나누기

| 위치             | 독자         | 담는 것                                  |
| ---------------- | ------------ | ---------------------------------------- |
| `README.md`      | 처음 온 사람 | 프로젝트 소개, 시작 명령                 |
| `docs/`          | 팀원         | 흐름·이유·예시. 상세 조항은 rules로 링크 |
| `CLAUDE.md`      | AI 에이전트  | 항상 지키는 핵심 원칙 (부트로더)         |
| `.claude/rules/` | AI·리뷰 기준 | 작업별 상세 판단 기준 (단일 기준)        |

같은 규칙을 docs와 rules에 따로 쓰지 않는다. docs에서는 요약하고 rules로 링크한다.
