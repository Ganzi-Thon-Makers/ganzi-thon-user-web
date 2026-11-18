# 검증 규칙

주장을 증명할 수 있는 가장 작은 검증부터 실행한다. 완료 보고 전에는 `CLAUDE.md`의 필수 검증(`pnpm check`, `pnpm test:run`)을 통과시킨다.

## 변경 범위별 검증

| 변경 범위                      | 작업 중 빠른 확인                                                    | 완료 전 추가                              |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------- |
| 문서·에이전트 설정             | `pnpm exec oxfmt --check <변경 파일>`                                | 훅 스크립트를 바꿨으면 샘플 입력으로 실행 |
| 컴포넌트·스타일                | `pnpm exec oxlint <변경 파일>`, 관련 `pnpm exec vitest run <테스트>` | 화면 확인(좁은 화면 우선)                 |
| 타입·export·import 경계        | `pnpm typecheck`                                                     | —                                         |
| API·쿼리·상태                  | 관련 컴포넌트 테스트                                                 | —                                         |
| route·layout·Provider·설정·env | `pnpm typecheck`                                                     | `pnpm build`                              |
| `.github/`·`lefthook.yml`      | 정적 일관성 확인                                                     | 실제 이벤트·권한은 CI에서 확인            |

- `<변경 파일>`에는 실제 수정 파일만 넣는다.
- UI 변경은 명령 통과만으로 완료하지 않는다. 화면을 볼 수 없으면 공백으로 남긴다. Figma와 화면이 둘 다 있으면 `ganzi-visual-verifier`로 비교한다(`visual-verification.md`).
- 번들 영향(`'use client'` 경계 이동, 동적 import)은 `pnpm exec next experimental-analyze`나 `pnpm build` 후 `.next/static/chunks` 크기로 전후 비교해 PR에 남긴다.
- `pnpm format`·`oxlint --fix` 뒤에 같은 파일을 다시 고치려면 먼저 다시 읽는다.

## 자동 훅은 검증을 대신하지 않는다

- `lint-check.mjs`는 편집 직후 파일 하나만 oxlint로 본다. 타입·테스트·포맷은 보지 않는다.
- lefthook `pre-commit`은 staged 파일만 검사한다.

## 실패와 보고

- 실패한 명령을 성공한 다른 명령으로 덮지 않는다. 출력, 영향 범위, 다음 확인 항목을 남긴다.
- sandbox·네트워크·권한 같은 환경 제약 실패는 코드 실패와 구분해 적는다.
- 보고 순서: 변경 결과 → 실행한 명령과 결과 → 실행하지 못한 검증과 이유 → 남은 위험. 실행하지 않은 명령을 통과라고 쓰지 않는다.
