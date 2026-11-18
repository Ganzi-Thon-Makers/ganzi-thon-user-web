@.claude/README.md

# 간지톤 사용자 웹

간지톤 사용자용 웹 프론트엔드.

## 기술 스택

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4, Base UI(`shared/ui`에서 래핑해 디자인 적용), cva
- TanStack Query + Suspensive, Zustand, ky
- oxlint, oxfmt, Vitest + Testing Library, lefthook, pnpm

## 주요 명령어

- `pnpm dev`: 개발 서버
- `pnpm format`: 포맷 자동 수정
- `pnpm check`: 타입체크 + 린트 + 포맷 검사 (CI와 같음)
- `pnpm test:run`: 테스트
- `pnpm build`: 프로덕션 빌드

## 작업 원칙

- 사용자가 따로 요청하지 않으면 한국어로 답한다. 진행 설명, 커밋·PR 제안, 리뷰 코멘트 모두 해당하며, 코드 식별자·명령어·패키지 이름만 원문으로 둔다.
- 작업 트리의 기존 사용자 변경을 보존한다. 요청과 관계없는 변경을 되돌리거나 덮어쓰지 않는다.
- Next.js 16·ky 2·Base UI API는 학습 데이터와 다르다. 코드를 쓰기 전에 `node_modules/next/dist/docs/`와 각 패키지 README·docs를 먼저 확인하고 deprecation 안내를 따른다.
- 작업 전에 `.claude/README.md`(Codex는 직접 열어 읽는다)의 로딩 표에서 작업에 맞는 `.claude/rules/*.md`만 골라 읽는다.
- 의존 방향은 app → features → shared. `src/app/`은 라우팅만, 도메인 코드는 `src/features/<도메인>/`. 자세한 건 `.claude/rules/architecture.md`.
- 파일을 고친 뒤에는 `pnpm format`을 돌린다.
- 작업을 끝냈다고 말하기 전에 `pnpm check`와 `pnpm test:run`을 통과시킨다. 라우트·설정을 바꿨다면 `pnpm build`도 돌린다. 이어서 `.claude/agents/README.md`의 역할 선택표에 맞는 검증 에이전트를 최소 한 번 호출한다.
- lint 에러를 규칙 끄기(`oxlint-disable`)로 피하지 않는다. 레이어 규칙에 걸리면 코드 위치를 옮긴다.
- 의존성은 pnpm으로만 추가한다. 새 라이브러리는 추가하기 전에 사람에게 먼저 묻는다.

## 커밋

- 메시지는 Conventional Commits, 제목은 한글로 쓴다. 예) `feat(posts): 게시글 목록 필터 추가`
- 훅이 실패하면 원인을 고치고 다시 커밋한다. `LEFTHOOK=0`이나 `--no-verify`로 건너뛰지 않는다.

## 진행 현황 기록

- 기능 진행 상황은 팀 노션 [기능 진행 현황](https://app.notion.com/p/41acf10cd2e7800b941ddc05c0bb1e93) DB에 [기능 명세서](https://app.notion.com/p/405cf10cd2e78021a044e44a5e0f2bbb)의 번호(`STAMP-02` 등) 단위로 기록한다.
- PR을 올리거나 병합하면, 또는 목 데이터를 실제 API로 바꾸면 해당 행의 프론트 상태·PR·이슈 링크·메모를 갱신한다. 상태는 `미착수`·`진행중`·`리뷰중`·`완료(목)`·`완료`·`불필요` 중 하나를 쓴다.
- 백엔드 칸은 서버 레포 PR과 dev Swagger에 실제로 올라온 API만 근거로 고친다.
- Notion MCP로 접근할 수 없으면(게스트 계정 등) 브라우저로 갱신하거나, 바꿀 행과 값을 사용자에게 정리해 준다.
