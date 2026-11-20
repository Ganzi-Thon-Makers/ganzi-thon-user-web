# timeline API

행사 타임테이블 목록 조회. 명세 확인일 2026-11-19.

## Endpoints

| Method | Path                | Operation          | 비고                                 |
| ------ | ------------------- | ------------------ | ------------------------------------ |
| GET    | `/api/v1/timetable` | `getAllTimeTables` | Bearer 인증 필요. 시작 시간 오름차순 |

## `TimetableAllResponse`

성공 응답의 `data`에 목록이 담긴다.

| Field        | Type          | 비고      |
| ------------ | ------------- | --------- |
| `timetables` | `Timetable[]` | 일정 목록 |

## `Timetable`

| Field         | Type                  | 비고                                                             |
| ------------- | --------------------- | ---------------------------------------------------------------- |
| `id`          | number                | 일정 ID                                                          |
| `title`       | string                | 일정 제목                                                        |
| `description` | string (Swagger 표기) | 생성·수정은 `null` 허용. 서버는 저장 값을 목록 DTO로 그대로 전달 |
| `startTime`   | string                | `HH:mm`                                                          |
| `endTime`     | string                | `HH:mm`                                                          |

## 구현 메모

- 시간 문자열에는 날짜와 오프셋이 없다. 진행 중 표시는 프론트에서 행사 날짜와 KST를 적용한다.
- Swagger에서 인증 실패 `401`을 명시한다.
