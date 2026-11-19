# stamp API

부스 방문 스탬프 적립·조회와 스탬프판 구성. 명세 확인일: 2026-11-17 (서버 PR #15 `feat/stamp-qr-collection` bdf2a8a 기준, 아직 `dev` 병합 전)

서버 API가 `dev`에 없어 프론트는 `stamp.api.ts`에서 목 응답을 쓴다. 아래 서버 계약은 PR #15 코드로 확인한 것이다. 병합되면 Swagger와 다시 맞춘다.

## Endpoints (서버 PR #15)

| Method | Path                | 권한            | 요청        | 응답 `data`                                                                          |
| ------ | ------------------- | --------------- | ----------- | ------------------------------------------------------------------------------------ |
| POST   | `/api/v1/qr-tokens` | `TEAM`만        | —           | `token`, `expiresAt`(LocalDateTime), `ttlSeconds`(60)                                |
| POST   | `/api/v1/stamps`    | `PARTICIPANT`만 | `{ token }` | `collectedCount`, `remainingToLuckyDraw`, `luckyDrawEntered`, `luckyDrawJustEntered` |
| GET    | `/api/v1/stamps`    | 로그인 사용자   | —           | `collectedCount`, `remainingToLuckyDraw`, `luckyDrawEntered`, `stamps[]`             |

- `stamps[]` 항목: `boothId`, `zone`(`ZONE1`·`ZONE2`·`ZONE3`), `boothNumber`, `collectedAt`
- QR 발급자는 부스 팀 계정(`Role.TEAM`)이다. 서버가 팀 계정의 `projectId`로 부스를 찾아서, 발급자가 부스를 지정하지 않는다. 재발급해도 이전 토큰을 무효화하지 않고 새로 만든다.
- 역할: `PARTICIPANT`, `TEAM`(한 기기 로그인), `ADMIN`, `SUPER_ADMIN`(백오피스)
- 설정값: 토큰 유효 60초, 만료 후 유예 10초(E2E로 조정 예정), 연속 적립 제한 300초

### 적립 에러 (`ErrorCode`)

| 상황               | 상태 | 코드(서버 enum)           | 프론트 결과(`CollectStampResult`) |
| ------------------ | ---- | ------------------------- | --------------------------------- |
| 유효하지 않은 토큰 | 400  | `QR_TOKEN_NOT_FOUND`      | `invalid-token`                   |
| 만료된 토큰        | 400  | `QR_TOKEN_EXPIRED`        | `expired`                         |
| 이미 적립한 부스   | 409  | `STAMP_ALREADY_COLLECTED` | `already-collected`               |
| 5분 내 연속 적립   | 429  | `STAMP_COOLDOWN`          | `cooldown`                        |
| 참가자가 아님      | 403  | `FORBIDDEN`               | (요청 실패로 처리)                |

### QR 발급 (dev Swagger 확인 2026-11-19, 프론트 연결됨)

| Method | Path                  | Operation      | 권한          | 응답 `data`에서 쓰는 필드                             |
| ------ | --------------------- | -------------- | ------------- | ----------------------------------------------------- |
| POST   | `/api/v1/qr-tokens`   | —              | `TEAM`만      | `token`, `ttlSeconds`(60). `expiresAt`도 오지만 안 씀 |
| GET    | `/api/v1/projects/me` | `getMyProject` | 로그인 사용자 | `title` → 화면 제목의 서비스 이름                     |

- 화면은 서버 `expiresAt`을 쓰지 않고 `받은 시점 + ttlSeconds`로 만료 시각을 만든다. 서버 `QrTokenService`가 Seoul `Clock` 대신 `LocalDateTime.now()`(JVM 기본 시간대, Docker 기본 UTC)로 `expiresAt`을 만들어 기기 시각과 9시간 어긋날 수 있어서다. 서버가 `Clock`을 쓰도록 고치면 `expiresAt`으로 되돌려도 된다. 에러는 401, 403 `FORBIDDEN`(팀 계정 아님), 404 `USER_NOT_FOUND`·`BOOTH_NOT_FOUND`.
- `projects/me`는 서버 `SecurityPaths`에 역할 제한이 없고, 사용자 `projectId`로 조회한다(`ProjectBoothQueryFacade.getMyProject`). 팀에 프로젝트가 없으면 404 `PROJECT_NOT_FOUND`이고, 이때 QR 발급 화면은 `PageError`로 넘어간다.
- 팀 계정은 로그인 직후 `/operator/qr`로 이동한다. role은 access token의 `role` claim으로 판별한다(`auth.md`).

### 서버에 요청할 것

- 적립 성공 응답과 409 에러에 `boothId`가 없다. 화면은 적립한 부스의 구역을 펼쳐야 해서(STAMP-03) 둘 다 필요하다.
- `ErrorResponse`에 `code`가 없어, 같은 400인 만료와 유효하지 않은 토큰을 메시지 문자열로만 나눌 수 있다.

## 프론트 함수

| 프론트 함수           | 용도                      | 쿼리 키                                            |
| --------------------- | ------------------------- | -------------------------------------------------- |
| `getMyStamps()`       | 내 스탬프 목록            | `["stamps", "mine"]`                               |
| `getStampZones()`     | 스탬프판 구역·구역별 부스 | `["stamps", "zones"]`                              |
| `collectStamp(token)` | QR 토큰으로 스탬프 적립   | — (적립·이미 받음이면 `["stamps", "mine"]` 무효화) |
| `getOperatorBooth()`  | QR 발급 화면 제목         | `["stamps", "operator-booth"]`                     |
| `issueStampToken()`   | 스탬프 QR 토큰 발급       | — (발급한 토큰은 캐시에 두지 않음)                 |

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

- 같은 부스 스탬프는 한 번만 받는다(DB unique 제약, 서버 409).
- 적립(STAMP-03)은 부스 운영자 QR의 토큰으로 한다. QR 내용은 `<사이트 주소>/stamp/collect?token=<토큰>`이라 앱 스캐너와 휴대폰 기본 카메라가 같은 처리를 거친다. 토큰 발급·만료·검증은 서버 몫이다(위 Endpoints).
- `collectStamp(token)`은 경우마다 화면 안내가 달라서 에러 대신 결과로 돌려준다(위 적립 에러 표). 서버 상태 코드를 이 결과로 바꾸는 일은 `stamp.api.ts`에서 한다. 만료·유효하지 않은 토큰은 같은 스캔 동안 다시 보내지 않는다.
- 목 토큰 형식: `mock-stamp-<boothId>` (`stamp.mock.ts`의 `createMockStampToken`). 로컬에서 기본 카메라 흐름을 볼 때는 `/stamp/collect?token=mock-stamp-5`로 들어가면 된다.
- 프론트 `StampZone`·`StampBoardBooth`는 화면용 임시 형태다. 서버 `Booth`에는 부스 이름이 없고(`projectId`로 프로젝트에서 가져와야 할 것으로 보임), 구역 수료 기준 `requiredCount`도 서버·명세에 없다.
- 럭키드로우: 서버가 15개 최초 달성 시 자동 응모하고, 적립 응답 `luckyDrawJustEntered`로 "이번에 응모됨"을 알려준다. 프론트의 기기 기록(`use-lucky-draw-notice`)은 실제 API 연결 때 이 값으로 바꾼다.
- 서버 `ErrorResponse`에 `code` 필드가 없다. `shared/api/error.ts`의 `ErrorBody`(`code`, `message`)와 어긋나므로, 공통 envelope 처리 시 함께 맞춘다.
- 화면 문구: 디자인에는 "이미 수집한 스탬프입니다."만 있다. 만료는 인식 실패 문구를 함께 쓰고, 연속 적립 제한은 임시 문구다(TODO).
- 인증: 스탬프 API는 모두 로그인 필요(JWT). 적립은 참가자, QR 발급은 팀 계정만 된다.
