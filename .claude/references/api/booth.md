# booth API

부스 전체 조회. 명세 확인일 2026-11-20. 성공 응답은 Platform OpenAPI, 오류 코드는 전체 OpenAPI에서 확인했다.

## Endpoints

| Method | Path            | Operation      | 비고             |
| ------ | --------------- | -------------- | ---------------- |
| GET    | `/api/v1/booth` | `getBoothsAll` | Bearer 인증 필요 |

## 응답

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
- 프로젝트 상세 API는 #111에서 연결한다.
