# project API

프로젝트 목록·상세 조회. 명세 확인일: 2026-11-16 (dev Swagger, 실제 응답으로 확인)

## Endpoints

| Method | Path                           | Operation          | 비고                        |
| ------ | ------------------------------ | ------------------ | --------------------------- |
| GET    | `/api/v1/projects`             | `getProjects`      | 구역별로 묶은 전체 목록     |
| GET    | `/api/v1/projects/{projectId}` | `getProjectDetail` | 없는 id는 404 `{ message }` |

## 공통 envelope

`{ data: T, message?: string }`. 프론트 타입은 `shared/api/types.ts`의 `ApiResponse<T>`.

## 목록 응답 `data`

`Record<Zone, ProjectSummaryResponse[]>` (`Zone`: `ZONE1`·`ZONE2`·`ZONE3`). 프로젝트가 없는 구역은 키가 빠질 수 있다고 보고 `?? []`로 읽는다.

| Field          | Type             | 비고               |
| -------------- | ---------------- | ------------------ |
| `id`           | number           |                    |
| `title`        | string           |                    |
| `teamName`     | string           | 화면 미사용        |
| `summary`      | string           |                    |
| `thumbnailUrl` | string           | NCP Object Storage |
| `platform`     | `"APP" \| "WEB"` |                    |

## 상세 응답 `data` (ProjectDetailResponse)

목록 필드에 더해:

| Field         | Type                                | 비고                                    |
| ------------- | ----------------------------------- | --------------------------------------- |
| `description` | string                              |                                         |
| `serviceUrl`  | string \| null                      | APP 프로젝트는 실제로 `null`이 온다     |
| `techStack`   | string                              | 쉼표 구분 문자열                        |
| `zone`        | Zone                                | 화면 미사용                             |
| `boothNumber` | number                              | 화면 미사용                             |
| `members`     | `{ part: Part, names: string[] }[]` | 서버가 파트별로 묶고 순서도 정해서 준다 |

`Part`: `PLAN`·`DESIGN`·`WEB`·`APP`·`SERVER`

## 구현 메모

- 인증 없이 200 응답. Swagger에 `bearerAuth`는 정의돼 있지만 이 두 엔드포인트는 토큰을 요구하지 않는다.
- 에러 body에 `code`가 없어 `toApiError`는 `HTTP_<status>`로 대체한다.
- Swagger에 required 표시가 없어 `serviceUrl` 외 필드의 nullable 여부는 미확인.
