# 다른 feature 캐시는 shared의 루트 키로 무효화한다

- 상태: accepted
- 기록일: 2026-11-11

> **구현 상태 (2026-11-11 확인): 미구현.** 아직 feature 간 무효화가 필요한 기능이 없다. 처음 필요해질 때 `src/shared/api/query-keys.ts`를 만든다.

## 맥락

feature 간 import는 oxlint로 금지되어 있다. 그런데 한 feature의 변경이 다른 feature 목록을 바꾸는 경우(댓글 작성 → 게시글 목록의 댓글 수)에는 다른 feature의 쿼리 키가 필요하다.

## 결정

- `src/shared/api/query-keys.ts`에 도메인 루트 키 상수만 둔다(예: `posts: ["posts"] as const`).
- 각 feature 쿼리 팩토리의 `all()`은 이 루트 키를 그대로 쓴다.
- 다른 feature는 루트 키로만 무효화한다(`invalidateQueries({ queryKey: QUERY_ROOT_KEYS.posts })`). 하위 키(list·detail)는 각 feature 안에만 둔다.

## 근거

공용 파일에 도메인 이름 상수만 두므로 `shared`가 도메인 로직을 알지 않고, 레이어 규칙을 끄지 않아도 된다.

## 고려한 대안

- 무효화를 두 feature를 아는 상위(page)에서 조합: 공용 파일은 없지만 무효화 흐름이 화면마다 흩어진다.
- feature 간 import 허용: 레이어 규칙이 무너진다.

## 영향 범위

`src/shared/api/query-keys.ts`(신규), 각 `features/*/api/*.queries.ts`의 `all()`.

## 검증 또는 재검토 조건

루트 키만으로 무효화 범위가 너무 넓어 체감 성능 문제가 생기면 재검토한다.

## 변경 기록

- 2026-11-11: 최초 기록
