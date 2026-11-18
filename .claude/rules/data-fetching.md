# 데이터·상태 규칙

ky 2(`prefix`/`baseUrl`, 훅 인자 `{ request }`)와 TanStack Query API는 `node_modules`의 README·docs로 먼저 확인한다.

## 계층

```text
컴포넌트 → <도메인>.queries.ts (queryOptions·mutationOptions) → <도메인>.api.ts → shared/api/client (api)
```

- HTTP는 `@/shared/api/client`의 `api`만 쓴다. `fetch`·ky를 직접 쓰지 않는다.
- `<도메인>.api.ts`는 데이터만 반환하고 React를 모른다. 컴포넌트는 엔드포인트를 모르고 팩토리만 쓴다.
- 토큰 처리는 `shared/api/client.ts`·`token.ts`에만 둔다.

## 조회

```ts
export const postQueries = {
  all: () => ["posts"] as const,
  list: (params: PostListParams = {}) =>
    queryOptions({ queryKey: [...postQueries.all(), "list", params], queryFn: () => getPosts(params) }),
  detail: (id: number) => queryOptions({ queryKey: [...postQueries.all(), "detail", id], queryFn: () => getPost(id) }),
};
```

- 쿼리는 이 팩토리로만 정의한다. 컴포넌트에 queryKey를 직접 쓰지 않는다.
- 키는 루트 `all()` 아래로 계층을 만들고, 하위 키는 인자가 없어도 함수로 둔다.
- 응답에 영향을 주는 params는 전부 키에 넣는다. 빠지면 다른 조건의 캐시가 섞인다.
- 조회는 `useSuspenseQuery`가 기본이다. 독립적인 쿼리는 형제 컴포넌트로 나누거나 `useSuspenseQueries`를 쓴다.
- 무한 스크롤은 `useSuspenseInfiniteQuery`. observer effect의 deps에 `hasNextPage`·`isFetchingNextPage`·`fetchNextPage`를 모두 넣고(빠지면 첫 로드에서 안 붙는다), sentinel은 뷰 분기 바깥에 둔다.

## 변경 (mutation)

> 위치는 아직 강제하지 않는 권장 기본값이다. 팀이 다르게 정하면 이 절과 결정 기록을 고친다.

```ts
export const postMutations = {
  create: () =>
    mutationOptions({
      mutationFn: createPost,
      onSuccess: (_data, _vars, _result, { client }) => client.invalidateQueries({ queryKey: postQueries.all() }),
    }),
};

// 컴포넌트
const createPost = useMutation(postMutations.create());
createPost.mutate(input, { onSuccess: () => router.push("/posts") });
```

- 같은 `<도메인>.queries.ts`에 `<도메인>Mutations`로 둔다. 조회·변경 키가 한 파일에 모여 무효화 누락이 준다.
- 캐시 무효화는 팩토리의 `onSuccess`(4번째 인자 `context.client`)에서, 화면 이동·안내처럼 화면마다 다른 후속 동작은 컴포넌트의 `mutate(..., { onSuccess })`에서 한다.
- 폼 검증 로직은 해당 feature 안, 폼 컴포넌트 가까이에 둔다. 폼 라이브러리 도입은 먼저 묻는다.

## 캐시 갱신

| 상황                         | 방법                |
| ---------------------------- | ------------------- |
| 잦은 작은 토글(좋아요, 댓글) | 낙관적 업데이트     |
| 응답으로 새 엔티티가 옴      | `setQueryData`      |
| 그 외                        | `invalidateQueries` |

- 범위는 "이 변경이 어떤 화면의 목록을 바꾸는가"로 정한다. 다른 feature 목록도 바뀌면 그 feature 키를 import하지 않고 `shared/api/query-keys.ts`의 루트 키로 무효화한다(결정 002. 파일은 처음 필요해질 때 만든다).
- 변경 직후 다른 화면으로 이동하면 `router.push` 전에 목적지가 읽는 키를 `setQueryData`로 확정한다. `invalidateQueries`는 기다리지 않고 끝나서 목적지가 옛 캐시를 먼저 읽을 수 있다.
- 낙관적 업데이트: `onMutate`에서 `cancelQueries` → 이전 값 snapshot 후 `setQueryData` → snapshot 반환 / `onError`에서 롤백 / `onSuccess`에서 서버 응답으로 교체 / 필요하면 `onSettled`에서 invalidate.

## 에러

- 에러는 `toApiError()`로 변환해서 다룬다.
- 사용자 문구는 프론트 문구가 기본이고, 백엔드 `message`는 사용자에게 의미 있는 비즈니스 에러에서만 opt-in한다(결정 001). 구현 전까지 `toApiError().message`는 백엔드 문구일 수 있으니 화면 문구는 `code`·`status`로 정한다.
- `"Request failed with status code 400"` 같은 원본 메시지를 그대로 보이지 않는다.
- 상태별 처리: 보호 경로의 401은 로그인으로, 403·404는 각 화면 안내로, 5xx·네트워크 오류만 에러 화면(`PageError`)으로.
- 서버 검증 에러에 필드 정보가 있으면 해당 입력 옆에 표시한다.

## 상태 위치

| 상태                              | 위치                                   |
| --------------------------------- | -------------------------------------- |
| 서버 데이터                       | TanStack Query                         |
| URL로 공유돼야 하는 값 (필터, 탭) | searchParams                           |
| 여러 컴포넌트가 함께 쓰는 UI 상태 | Zustand (`features/<도메인>/store.ts`) |
| 앱 전역 UI 상태                   | Zustand (`shared/stores/`)             |
| 한 컴포넌트 안의 UI 상태          | `useState`                             |

- 서버 데이터를 Zustand에 복사하지 않는다. 같은 값(로그인한 사용자 등)을 화면마다 다른 출처로 읽지 않는다.

## API 계약

- 엔드포인트·파라미터·응답 필드를 추측하지 않는다. 백엔드 명세(Swagger 등)로 확인하고 `.claude/references/api/<도메인>.md`에 남긴 뒤 구현한다. 계약이 불명확하면 정적 데이터로 화면만 만들고 API gap으로 보고한다.
- 타입은 화면이 실제로 쓰는 필드만 둔다. 명세에 없는 필드·enum을 만들지 않는다.
- 서버 필드명과 도메인 이름이 다르면(`pubDate` → `publishedAt`) raw 타입으로 받아 `<도메인>.api.ts`에서 매핑한다. `as` 단언으로 넘기면 런타임에 `undefined`가 된다.
- 공통 응답 envelope·에러 형식(`shared/api/error.ts`의 `ErrorBody`)은 실제 응답으로 확인한 뒤 `shared/api` 한 곳에서만 처리한다.
- API 주소는 코드·문서에 쓰지 않고 `env`로만 읽는다.

## 요청 세부

- PATCH에서 "변경 없음"은 키를 빼서 표현한다. 명세에 없는 값(빈 문자열 등)을 보내지 않는다.
- `searchParams`에 넘기기 전에 `null`·`undefined`는 뺀다. 배열은 같은 키를 반복한다(`?tags=a&tags=b`).
- 독립적인 요청은 `Promise.all`로 병렬 처리하고, 결과가 필요 없는 요청(분석 이벤트)은 기다리지 않는다.

## 인증·세션

- 인증 방식(토큰 저장·재발급)은 백엔드와 정해지면 결정 기록으로 남기고 여기에 규칙을 추가한다.
- 세션이 끝날 때(로그아웃·탈퇴·만료)와 새로 시작하기 직전(로그인·OAuth 콜백) `queryClient.clear()`로 캐시를 비운다. 5xx·네트워크 실패에서는 비우지 않는다.
- URL로 받은 토큰 처리는 `security.md`.
