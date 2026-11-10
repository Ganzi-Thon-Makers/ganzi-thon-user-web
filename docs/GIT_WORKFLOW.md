# Git과 PR 흐름

상세 조항: [`.claude/rules/git-workflow.md`](../.claude/rules/git-workflow.md)

## 브랜치

```text
이슈 생성 → develop에서 브랜치 → 구현·검증 → 커밋 → develop 대상 PR → 리뷰 → 병합
```

- 이슈는 `작업 이슈` 폼으로 만든다. 작업 타입을 고르면 `develop`에서 `<타입>/<이슈 번호>` 브랜치가 자동으로 생기고(`.github/workflows/issue-branch.yml`), 이슈 댓글에 브랜치로 바꾸는 명령이 달린다. PR을 열면 작성자가 담당자로, 타입이 라벨로 붙는다(`pr-metadata.yml`).
- 작업 타입은 8개(`feat`·`fix`·`hotfix`·`refactor`·`style`·`test`·`docs`·`chore`)이고 각각 ✨ Feature·🐛 BugFix·🚨 Hotfix·♻️ Refactor·🎨 Style·✅ Test·📝 Docs·🔧 Chore 라벨로 붙는다. 성능 개선은 refactor, 빌드·CI는 chore로 고른다. hotfix는 브랜치·라벨만 따로 두고 커밋은 `fix:`로 쓴다.
- 라벨은 저장소 Labels에 만들어 두었다. 라벨 이름을 바꾸면 `issue-branch.yml`·`pr-metadata.yml`의 `LABELS`도 같이 바꾼다.
- 기준 브랜치는 `develop`이다. 일반 작업 PR은 모두 `develop`을 대상으로 한다.
- `main`은 배포용이며 `develop`에서만 병합한다.
- 브랜치 이름은 `<type>/<이슈 번호>` 형태를 쓴다. 예) `feat/5`

## 커밋

[Udacity Git Commit Message Style Guide](https://udacity.github.io/git-styleguide/)를 바탕으로 scope를 쓰는 Conventional Commits 형식을 쓴다. 제목은 한글이고, `commitlint.config.mjs`가 검사한다.

```text
<type>(<scope>): <제목>

feat(posts): 게시글 목록 필터 추가
fix: 토큰 만료 시 재요청되지 않는 문제 수정
```

- type: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`, `ci`, `build`, `perf`, `revert`
- scope는 feature 도메인(`home`, `posts`)이나 영역(`shared`, `ci`). 애매하면 생략한다.
- 제목은 100자 이내, 파일명 나열 대신 변경 목적을 쓴다.
- 독립적으로 되돌릴 수 있는 변경은 커밋을 나눈다.
- 본문에는 무엇을·왜 바꿨는지 쓴다. 이슈를 닫으면 푸터에 `Closes #12`.
- `Co-Authored-By` 같은 AI 출처 문구는 넣지 않는다.

## PR

- PR 제목은 커밋과 같은 형식(`feat(home): ...`)을 권장한다. 병합 방식(squash·merge commit)은 정해두지 않았다.
- 본문은 `.github/pull_request_template.md`를 채운다: 무엇을·왜 바꿨는지, UI 변경 스크린샷, 리뷰어가 봐줄 부분, 체크리스트.
- 체크리스트는 실제로 실행한 검증만 체크한다.
- 관련 이슈가 있으면 `close #번호`로 연결한다.
- 새 라이브러리, lint·CI·AI 하네스처럼 팀 작업 방식을 바꾸는 변경은 본문에 이유와 영향을 적는다.

## 리뷰와 병합

- `.github/CODEOWNERS`에 팀원 3명이 모든 파일의 코드 오너로 있어서, PR을 열면 작성자를 뺀 두 명에게 리뷰 요청이 자동으로 간다.
- `develop` 대상 PR은 CodeRabbit이 자동으로 리뷰한다(드래프트 제외). 설정은 `.coderabbit.yaml`이고, 경로별 지침과 `.claude/rules`·`docs`를 기준으로 본다. 저장소에 CodeRabbit 앱이 설치되어 있어야 동작한다. 에이전트 도구·에디터 설정·문서 같은 프로젝트 세팅에는 코멘트를 달지 않는다. 필요하면 PR에 `@coderabbitai review`로 직접 요청한다.

- PR 작성자가 충돌을 해결하고, 남은 검증 공백을 본문에 적는다.
- CI(`commitlint`, `check`)가 통과해야 병합한다.
- 리뷰 반영 뒤에는 동작, 불필요한 로그, 관련 문서가 최신인지 다시 본다.
