---
name: commit
description: 변경 내용을 분석해 이 프로젝트 commitlint 규칙에 맞는 한글 Conventional Commit 메시지와 실행할 Git 명령을 제안한다.
user-invocable: true
allowed-tools: Bash, Read, Grep
---

# commit

메시지와 명령만 제안한다. 사용자가 직접 실행을 요청하지 않으면 `git add`·`git commit`을 실행하지 않는다.

## 작업 흐름

1. `git status --short`로 수정·삭제·추가 파일과 stage 상태를 확인한다.
2. `git diff`와 `git diff --staged`를 모두 본다.
3. `.claude/rules/git-workflow.md`, `commitlint.config.mjs`를 읽는다. 최근 스타일은 `git log --oneline -10`으로 확인한다.
4. **리뷰 게이트**: `.claude/rules/git-workflow.md`의 "리뷰 게이트"를 따른다. `src/` 코드가 바뀌었을 때만 `ganzi-reviewer`로 Critical·Major·Minor까지 확인한다(Suggestion 제외).
5. 변경 목적을 기능·수정·문서·테스트·설정·리팩터링으로 먼저 분류한다. 독립적으로 되돌릴 수 있는 변경은 커밋을 나눈다. `git status --short`의 파일 전체 목록을 기준으로 각 파일을 정확히 하나의 커밋에만 배정한다.
6. 각 커밋의 파일 묶음, 메시지, 명령을 함께 출력한다. 마지막에 리뷰 결과를 한 줄로 적는다(문제 없음 / 생략(이유) / 재사용).

## 메시지 규칙

- 기준은 `.claude/rules/git-workflow.md`(Udacity 스타일 기반 Conventional Commits). AI 출처 문구(`Co-Authored-By` 등)를 넣지 않는다.

- 형식: `<type>(<scope>): <한글 제목>` — scope는 feature 도메인(`home`, `posts`)이나 영역(`shared`, `ci`)이고, 한 영역으로 묶이지 않으면 생략한다.
- type은 `commitlint.config.mjs`(config-conventional)가 기준이다: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `ci`, `build`, `perf`, `revert`.
- 제목은 100자 이내, 파일명 나열 대신 변경 목적, 마침표 없음.
- 미검증 변경이 있으면 커밋 전 확인 항목을 따로 표시한다. pre-commit 훅(포맷·린트·타입체크·관련 테스트)이 돈다는 점을 감안한다.

필요하면 본문에 짧은 bullet, 이슈를 닫으면 푸터 `Closes #N`을 제안한다.

## 출력 형식

```text
커밋 1: feat(home): 홈 배너 영역 추가
- src/features/home/components/HomeBanner.tsx
- src/features/home/pages/HomePage.tsx
```

```bash
git add src/features/home/components/HomeBanner.tsx src/features/home/pages/HomePage.tsx
git commit -m "feat(home): 홈 배너 영역 추가"
```

괄호 등 셸 특수문자가 있는 경로는 큰따옴표로 감싼다(`"src/app/(main)/page.tsx"`). 지금 존재하는 경로만 넣는다.
