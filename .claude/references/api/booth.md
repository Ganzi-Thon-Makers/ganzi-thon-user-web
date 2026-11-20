# booth API

부스 전체 및 상세 조회. 명세 확인일 2026-11-20. 성공 응답은 Platform OpenAPI, 오류 코드는 전체 OpenAPI에서 확인했다.

## Endpoints

| Method | Path                      | Operation        | 비고                            |
| ------ | ------------------------- | ---------------- | ------------------------------- |
| GET    | `/api/v1/booth`           | `getBoothsAll`   | Bearer 인증 필요                |
| GET    | `/api/v1/booth/{boothId}` | `getBoothDetail` | Bearer 인증, 필수 int64 경로 ID |

## 목록 응답

`SuccessResponseBoothListResponse.data.booths`는 `ZONE1`, `ZONE2`, `ZONE3`별 부스 배열이다. 이번 행사 응답에는 세 구역 키가 모두 들어 있다.

| Field         | Type           | 비고                                               |
| ------------- | -------------- | -------------------------------------------------- |
| `boothId`     | number         | 부스 식별자                                        |
| `roomNumber`  | string         | 호실 또는 위치 문자열 원문                         |
| `boothNumber` | number         | 호실 내 부스 번호                                  |
| `teamNumber`  | number \| null | 이번 행사 응답의 각 부스에는 배정된 팀 번호가 있다 |

- 쿼리 키는 `["booths", "list"]`다. 응답을 호실별로 묶고 부스 번호순으로 정렬한다.
- 위치의 좌우 방향은 목록에 없다. 호실별 목록에서 `teamNumber`에 ‘팀’을 붙여 표시한다.
- 인증 실패 시 `401`을 반환한다. 공용 인증 클라이언트의 재발급 흐름을 사용한다.

## 상세 응답

`SuccessResponseBoothDetailResponse.data`는 부스에 배정된 프로젝트의 정보다.

| Field          | Type          | 비고          |
| -------------- | ------------- | ------------- |
| `projectId`    | integer int64 | 프로젝트 ID   |
| `platform`     | string        | 플랫폼        |
| `teamName`     | string        | 팀 이름       |
| `title`        | string        | 프로젝트 이름 |
| `summary`      | string        | 프로젝트 요약 |
| `thumbnailUrl` | string        | 썸네일 URL    |

- 목록의 `boothId`를 경로 파라미터로 보낸다. 쿼리 키는 `["booths", "detail", boothId]`다.
- 상세 404 응답은 `BOOTH_NOT_FOUND`(부스 없음)와 `PROJECT_NOT_FOUND`(미배정)를 구분한다.
- dev 비인증 요청은 401 `UNAUTHORIZED`를 반환했다. 인증된 200 응답은 확인하지 못했다.
