---
name: pull-request
description: 현재 브랜치 변경을 분석해 .github/pull_request_template.md에 맞는 PR 제목과 본문 초안을 만든다.
user-invocable: true
argument-hint: [--append]
allowed-tools: Bash, Read, Grep, Glob
---

# pull-request

PR 제목과 본문 초안을 만든다. 사용자가 명시하지 않으면 PR을 직접 만들지 않는다.

## 작업 흐름

1. `git status --short`, 현재 브랜치, `git log develop..HEAD --oneline`, `git diff develop...HEAD --stat`을 확인한다. 기본 대상 브랜치는 `develop`이다.
2. `.github/pull_request_template.md`와 `.claude/rules/git-workflow.md`를 읽는다. 템플릿을 이 스킬에 복제하지 않고 항상 현재 파일을 기준으로 쓴다.
3. 브랜치명(`<타입>/<이슈 번호>`)에서 이슈 번호를 뽑아 템플릿의 `관련 이슈` 섹션에 `close #N`으로 쓴다. 자동 종료가 필요 없으면 `#N`, 이슈가 없으면 추측하지 않고 섹션을 지운다.
4. **리뷰 게이트**: `.claude/rules/git-workflow.md`의 "리뷰 게이트"를 따른다. `/commit`에서 이미 본 커밋은 재사용하고, 아직 안 본 `src/` 변경만 확인한다.
5. 변경을 기능·수정·리팩터링·테스트·설정·문서·자동화로 분류하고, 리뷰어에게 중요한 영향부터 정리한다.
6. AI 지침·skill·hook·lint·CI 변경이 크면 [AI·자동화 PR 기준](templates/ai-automation-pr.md)을 읽는다.
7. 체크리스트는 이번 세션에서 실제로 실행해 통과한 항목만 체크한다. 실행하지 않은 검증은 체크하지 않고 그 사실을 적는다.

사용자가 PR 생성까지 명시적으로 요청한 경우에만 `gh auth status`로 확인한다. `gh`가 없거나 인증이 안 되어 있으면 만들지 않고 제목·본문만 출력한 뒤 GitHub에서 직접 만들라고 안내한다. 인증되어 있으면 `gh pr create --base develop --title ... --body-file -`로 만든다.

`--append`면 마지막 push 이후 커밋만 분석한다. 사용자가 기존 본문을 줬다면 다시 쓰지 않고 추가할 섹션·bullet만 제안한다.

## 제목

- 커밋 컨벤션과 같은 `<type>(<scope>): <한글 제목>` 형식. 브랜치에 커밋이 하나뿐이면 그 커밋 제목을 우선 쓴다.
- 커밋보다 PR의 목적과 리뷰 범위를 드러낸다.

## 본문

- 템플릿의 섹션 이름과 순서를 그대로 쓰고, 템플릿에 없는 최상위 섹션을 만들지 않는다.
- 큰 변경은 `무엇을 바꿨나요` 안에서 핵심 요약 2~4개와 세부 4~8개 bullet로 나눈다. bullet은 명사형(`AI 작업 기준 정리`)으로 쓴다.
- 자동화 workflow 변경은 트리거 / 수행 작업 / 사용자·리뷰어에게 보이는 결과를 설명한다.
- 검증하지 못한 항목은 `리뷰어가 봐주면 좋은 부분`에 쓴다.
- HTML 주석 안내문은 지우고 내용으로 채운다. 해당 없는 섹션(예: UI 변경 없는 PR의 `스크린샷`)은 템플릿 안내대로 지운다.
- `무엇을 바꿨나요`에는 파일 나열 대신 무엇을 바꿨는지와 영향 범위를, `왜 바꿨나요`에는 배경을 쓴다. 이슈 연결은 `관련 이슈` 섹션에만 쓴다.
- UI 변경인데 스크린샷이 없으면 사용자가 첨부해야 한다고 표시한다.

AI 출처 문구(`Generated with` 등)를 본문에 넣지 않는다.

## 출력 형식

- `제목: ...` 한 줄
- 본문은 그대로 복사할 수 있게 하나의 Markdown 코드 블록으로 준다.
