# stamp API

부스 방문 스탬프 적립·조회와 스탬프판 구성. 명세 확인일: 2026-11-15 (서버 `dev` 5ce528c 기준)

서버에 스탬프 컨트롤러가 아직 없어 Swagger 계약이 없다. 아래는 서버 엔티티로 확인한 사실과, 프론트가 목 데이터로 임시로 쓰는 형태를 나눠 적는다. 컨트롤러가 나오면 Endpoints와 응답 스키마를 Swagger 기준으로 다시 채운다.

## Endpoints

| Method | Path | Operation | 비고                                             |
| ------ | ---- | --------- | ------------------------------------------------ |
| —      | —    | —         | 미정. 프론트는 `stamp.api.ts`에서 목 응답을 쓴다 |

프론트가 필요로 하는 동작(서버와 합의 전):

| 프론트 함수       | 용도                      | 쿼리 키               |
| ----------------- | ------------------------- | --------------------- |
| `getMyStamps()`   | 내 스탬프 목록            | `["stamps", "mine"]`  |
| `getStampZones()` | 스탬프판 구역·구역별 부스 | `["stamps", "zones"]` |
| `createStamp(id)` | 부스 스탬프 적립          | —                     |

## Stamp (서버 엔티티 `stamp`)

| Field       | Type   | 비고                                    |
| ----------- | ------ | --------------------------------------- |
| `id`        | number | `BaseEntity`                            |
| `createdAt` | string | `LocalDateTime`, 타임존 없는 ISO 문자열 |
| `updatedAt` | string | `LocalDateTime`                         |
| `userId`    | number | not null                                |
| `boothId`   | number | not null. `(user_id, booth_id)` unique  |

## Booth (서버 엔티티 `booth`, 참고)

| Field         | Type   | 비고                             |
| ------------- | ------ | -------------------------------- |
| `id`          | number | `BaseEntity`                     |
| `projectId`   | number | nullable, unique                 |
| `zone`        | string | enum `ZONE1` · `ZONE2` · `ZONE3` |
| `roomNumber`  | string | 최대 20자                        |
| `boothNumber` | number |                                  |

## 공통 응답 (서버 `common/dto`)

| 형태              | 필드                                                         |
| ----------------- | ------------------------------------------------------------ |
| `SuccessResponse` | `data`, `message` (null이면 키 생략)                         |
| `ErrorResponse`   | `message`, `errors?: { field, reason }[]` (null이면 키 생략) |

## 구현 메모

- 같은 부스 스탬프는 한 번만 받는다(DB unique 제약). 중복 적립 시 에러 코드·상태는 아직 없다. 목은 `Error("이미 스탬프를 받은 부스입니다.")`로 거절한다.
- 프론트 `StampZone`·`StampBoardBooth`는 화면용 임시 형태다. 서버 `Booth`에는 부스 이름이 없고(`projectId`로 프로젝트에서 가져와야 할 것으로 보임), 구역 수료 기준 `requiredCount`도 서버·명세에 없다.
- 럭키드로우 응모(15개 최초 달성 시 자동 응모)는 서버 엔티티가 없다. 응모 여부를 서버가 내려줄지 프론트가 개수로 판단할지 미정.
- 서버 `ErrorResponse`에 `code` 필드가 없다. `shared/api/error.ts`의 `ErrorBody`(`code`, `message`)와 어긋나므로, 공통 envelope 처리 시 함께 맞춘다.
- 인증 필요 여부: 내 스탬프 조회·적립은 로그인 사용자 기준이 될 것으로 보이나 미확인.
