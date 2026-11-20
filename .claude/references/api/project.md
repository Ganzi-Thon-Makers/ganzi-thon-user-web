# project API

프로젝트 목록·상세·내 프로젝트 조회와 인기투표. 명세 확인일: 2026-11-19 (dev Swagger `platform` 그룹, 서버 `dev` 브랜치 코드)

## Endpoints

| Method | Path                           | Operation          | 비고                                     |
| ------ | ------------------------------ | ------------------ | ---------------------------------------- |
| GET    | `/api/v1/projects`             | `getProjects`      | 구역별로 묶은 전체 목록                  |
| GET    | `/api/v1/projects/{projectId}` | `getProjectDetail` | 없는 id는 404 `PROJECT_NOT_FOUND`        |
| GET    | `/api/v1/projects/me`          | `getMyProject`     | 소속 팀이 없으면 404 `PROJECT_NOT_FOUND` |
| GET    | `/api/v1/votes/period`         | `getPeriod`        | 투표 기간·상태                           |
| POST   | `/api/v1/votes`                | `submit`           | body `{ projectId }`, `data` 없음        |

## 공통 envelope

`{ data: T, message?: string }`. 프론트 타입은 `shared/api/types.ts`의 `ApiResponse<T>`.

## 목록 응답 `data`

`Record<Zone, ProjectSummaryResponse[]>` (`Zone`: `ZONE1`·`ZONE2`·`ZONE3`). 프로젝트가 없는 구역은 키가 빠질 수 있다고 보고 `?? []`로 읽는다.

| Field          | Type             | 비고                                       |
| -------------- | ---------------- | ------------------------------------------ |
| `id`           | number           |                                            |
| `title`        | string           |                                            |
| `teamName`     | string           | 화면 미사용                                |
| `summary`      | string           |                                            |
| `thumbnailUrl` | string           | NCP Object Storage                         |
| `platform`     | `"APP" \| "WEB"` |                                            |
| `isVoted`      | boolean          | 로그인한 사용자가 이 프로젝트에 투표했는지 |

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

## 투표 기간 응답 `data` (VotePeriodResponse)

| Field        | Type           | 비고                                                             |
| ------------ | -------------- | ---------------------------------------------------------------- |
| `status`     | `VoteStatus`   | `NOT_STARTED`·`IN_PROGRESS`·`PAUSED`·`ENDED`                     |
| `startTime`  | string \| null | offset 없는 LocalDateTime(서버 시각 KST). 일정 미등록이면 `null` |
| `endTime`    | string \| null | 마감 경계에서 투표 UI 잠금                                       |
| `serverTime` | string         | 서버 시각 기준 시작·마감까지 남은 시간 계산                      |

## 투표 에러 code

| Status | code                    | 뜻                              |
| ------ | ----------------------- | ------------------------------- |
| 400    | `VOTE_OWN_PROJECT`      | 본인 팀 프로젝트                |
| 403    | `VOTE_PARTICIPANT_ONLY` | 참가자(PARTICIPANT) 외 역할     |
| 409    | `VOTE_NOT_IN_PROGRESS`  | 투표 시간이 아님(일시중지 포함) |
| 409    | `VOTE_ALREADY_CAST`     | 이미 투표함                     |

## 구현 메모

- 모든 엔드포인트가 Bearer 토큰을 요구한다(토큰 없으면 401).
- 에러 body는 `{ status, code, message }`. 화면 문구는 `code`로 정한다(결정 001).
- Swagger에 required 표시가 없어 `serviceUrl` 외 필드의 nullable 여부는 미확인.
