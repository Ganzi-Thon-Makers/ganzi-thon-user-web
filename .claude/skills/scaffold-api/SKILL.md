---
name: scaffold-api
description: 백엔드 명세(Swagger 등)에서 확인한 엔드포인트로 types → api → queries 계층을 이 프로젝트 규칙대로 만든다.
user-invocable: true
argument-hint: <swagger-url 또는 endpoint·도메인>
---

# scaffold-api

먼저 `CLAUDE.md`, `.claude/rules/data-fetching.md`, `.claude/rules/architecture.md`, `.claude/rules/code-quality.md`, 관련 `.claude/references/api/*.md`를 읽는다. ky 2 API는 `node_modules/ky` README로 확인한다.

## 1. 계약 확인

- 명세나 reference에서 endpoint를 확인한다. reference에 없으면 구현 전에 `.claude/references/api/<도메인>.md`를 먼저 쓴다: path·method·operationId, path/query param, request·response 주요 필드, 에러 응답 또는 확인 필요 항목.
- Swagger UI 주소를 받으면 스펙 JSON을 찾는다: `/v3/api-docs`, `/swagger.json`, `/api-docs`, `/openapi.json` 순서(백엔드 프레임워크에 따라 다름).
- 타입 변환: integer → `number`, enum → `as const` 튜플과 파생 union, nullable은 `| null` 유지. 화면이 쓰는 필드만 고른다.
- 함수 이름: `getPosts` / `getPost` / `createPost` / `updatePost` / `deletePost`.
- 명세에 접근할 수 없거나 계약이 불명확하면 구현하지 않고 필요한 정보를 묻는다.

## 2. endpoint 선택

조건에 맞는 endpoint가 여럿이면 바로 구현하지 않고 `| Method | Path | Operation ID | Domain |` 표로 보여주고 고르게 한다.

## 3. 파일 작성 (필요한 것만)

1. `features/<도메인>/types.ts` — 서버 응답 raw 타입과 도메인 타입. 필드명이 다르면 둘 다 둔다.
2. `features/<도메인>/api/<도메인>.api.ts` — `@/shared/api/client`의 `api`로 호출하고 도메인 타입을 반환한다. React를 import하지 않는다. raw → 도메인 매핑은 여기서 한다.
3. `features/<도메인>/api/<도메인>.queries.ts` — `<도메인>Queries.all()` / `list(params)` / `detail(id)`를 `queryOptions`로 정의한다.
4. 변경 요청(POST/PUT/PATCH/DELETE)은 `data-fetching.md`의 mutation 규칙대로 `useMutation` + 팩토리 키 무효화로 연결한다.

## 규칙

- `any` 금지, 모르는 형태는 `unknown`에서 좁힌다.
- 명세에 없는 field·enum·status를 만들지 않는다.
- `multipart/form-data`는 FormData 변환을 api 함수 한 곳에서 한다.
- 컴포넌트는 path를 모른다. 쿼리 팩토리만 쓴다.
- 쿼리를 쓰는 컴포넌트를 만들면 `renderWithProviders` + `vi.mock("../api/<도메인>.api")` 테스트를 함께 쓴다(`/gen-test`).

## 4. 보고

만든·고친 파일, 사용한 endpoint, 무효화하는 키, 실행한 검증(`pnpm check`, `pnpm test:run`), 남은 API gap. 완료 전 서브에이전트로(Claude Code는 Agent 도구, Codex는 같은 이름의 에이전트) `ganzi-api-contract-reviewer`와 `ganzi-verifier`를 병렬 호출하고, `NEEDS_REVISION`이면 고친 뒤 다시 확인한다.
