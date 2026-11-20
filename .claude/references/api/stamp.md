# stamp API

부스 방문 스탬프 적립·조회와 QR 발급. 명세 확인일: 2026-11-19 (서버 `dev` PR #15 병합본, dev Swagger `/v3/api-docs`)

## Endpoints

| Method | Path                | 권한            | 요청        | 응답 `data`                                           |
| ------ | ------------------- | --------------- | ----------- | ----------------------------------------------------- |
| GET    | `/api/v1/stamps`    | `PARTICIPANT`만 | —           | `StampBoardResponse`                                  |
| POST   | `/api/v1/stamps`    | `PARTICIPANT`만 | `{ token }` | `StampCollectResponse`                                |
| POST   | `/api/v1/qr-tokens` | `TEAM`만        | —           | `token`, `expiresAt`(LocalDateTime), `ttlSeconds`(60) |

### StampBoardResponse

| Field                  | Type    | 비고                              |
| ---------------------- | ------- | --------------------------------- |
| `collectedCount`       | number  | 전체 적립 개수                    |
| `remainingToLuckyDraw` | number  | 15개까지 남은 개수 (화면은 안 씀) |
| `luckyDrawEntered`     | boolean | 럭키드로우 응모 여부              |
| `zoneStatuses[]`       | array   | `ZONE1`~`ZONE3` 순서              |

`zoneStatuses[]`: `zone`, `totalBooths`, `collectedCount`, `remainingCount`(= 전체 − 적립, 수료까지 남은 개수 아님), `completed`(적립 ≥ 서버 설정 `stamp.zone-completion-threshold`, 지금 5), `booths[]`

`booths[]`: `boothId`, `boothName`(팀 이름, 부스에 프로젝트가 없으면 null), `boothNumber`, `collected`, `collectedAt`

참가자 스탬프판에서는 `GET /api/v1/projects/me`의 `zone`과 `boothNumber`로 후보를 좁힌 뒤 `teamName`을 스탬프판의 `boothName`과 비교한다. 두 이름은 서버에서 같은 프로젝트의 팀 이름으로 채운다. 일치하는 후보가 한 곳일 때만 해당 `boothId`를 제외한다. dev Swagger `platform` 그룹과 서버 코드에서 2026-11-21 확인.

### StampCollectResponse

`boothId`, `collectedCount`, `remainingToLuckyDraw`, `luckyDrawEntered`, `luckyDrawJustEntered`, `alreadyCollected`

이미 적립한 부스면 에러 대신 200 + `alreadyCollected: true`로 응답한다(어느 부스인지 알려주려고).

### 적립 에러

| 상황               | 상태 | `code`                   | 프론트 결과(`CollectStampResult`) |
| ------------------ | ---- | ------------------------ | --------------------------------- |
| 유효하지 않은 토큰 | 400  | `QR_TOKEN_NOT_FOUND`     | `invalid-token`                   |
| 만료된 토큰        | 400  | `QR_TOKEN_EXPIRED`       | `expired`                         |
| 본인 팀 부스       | 400  | `STAMP_OWN_BOOTH`        | `own-booth`                       |
| 5분 내 연속 적립   | 429  | `STAMP_COOLDOWN`         | `cooldown`                        |
| 참가자가 아님      | 403  | `STAMP_PARTICIPANT_ONLY` | (요청 실패로 던짐)                |

- 설정값: 토큰 유효 60초, 만료 후 유예 10초(E2E로 조정 예정), 연속 적립 제한 300초
- QR 발급자는 부스 팀 계정(`Role.TEAM`)이다. 서버가 팀 계정의 프로젝트로 부스를 정한다. 재발급해도 이전 토큰을 무효화하지 않는다.

### QR 발급 (dev Swagger 확인 2026-11-19, 프론트 연결됨)

| Method | Path                  | Operation      | 권한          | 응답 `data`에서 쓰는 필드                             |
| ------ | --------------------- | -------------- | ------------- | ----------------------------------------------------- |
| POST   | `/api/v1/qr-tokens`   | —              | `TEAM`만      | `token`, `ttlSeconds`(60). `expiresAt`도 오지만 안 씀 |
| GET    | `/api/v1/projects/me` | `getMyProject` | 로그인 사용자 | `title` → 화면 제목의 서비스 이름                     |

- 화면은 서버 `expiresAt`을 쓰지 않고 `받은 시점 + ttlSeconds`로 만료 시각을 만든다. 서버 `QrTokenService`가 Seoul `Clock` 대신 `LocalDateTime.now()`(JVM 기본 시간대, Docker 기본 UTC)로 `expiresAt`을 만들어 기기 시각과 9시간 어긋날 수 있어서다. 서버가 `Clock`을 쓰도록 고치면 `expiresAt`으로 되돌려도 된다. 에러는 401, 403 `FORBIDDEN`(팀 계정 아님), 404 `USER_NOT_FOUND`·`BOOTH_NOT_FOUND`.
- `projects/me`는 서버 `SecurityPaths`에 역할 제한이 없고, 사용자 `projectId`로 조회한다(`ProjectBoothQueryFacade.getMyProject`). 팀에 프로젝트가 없으면 404 `PROJECT_NOT_FOUND`이고, 이때 QR 발급 화면은 `PageError`로 넘어간다.
- 팀 계정은 로그인 직후 `/operator/qr`로 이동한다. role은 access token의 `role` claim으로 판별한다(`auth.md`).

## 프론트 함수

| 프론트 함수           | 용도                                       | 쿼리 키                                           |
| --------------------- | ------------------------------------------ | ------------------------------------------------- |
| `getStampBoard()`     | 스탬프판(구역별 부스·적립 여부·럭키드로우) | `["stamps", "board"]`                             |
| `getMyStampBooth()`   | 참가자 본인 부스의 구역·번호 조회          | `["stamps", "my-booth"]`                          |
| `collectStamp(token)` | QR 토큰으로 적립                           | — (적립·이미 받음이면 `["stamps", "board"]` 갱신) |
| `getOperatorBooth()`  | QR 발급 화면 제목                          | `["stamps", "operator-booth"]`                    |
| `issueStampToken()`   | 스탬프 QR 토큰 발급                        | — (발급한 토큰은 캐시에 두지 않음)                |

## 공통 응답 (서버 `common/dto`)

| 형태              | 필드                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `SuccessResponse` | `data`, `message` (null이면 키 생략)                                          |
| `ErrorResponse`   | `status`, `code`(`ErrorCode` 이름), `message`, `errors?: { field, reason }[]` |

## 구현 메모

- 적립(STAMP-03)은 부스 운영자 QR의 토큰으로 한다. QR 내용은 `<사이트 주소>/stamp/collect?token=<토큰>`이라 앱 스캐너와 휴대폰 기본 카메라가 같은 처리를 거친다.
- 적립·중복 성공 응답은 캐시된 스탬프판의 방금 받은 칸, 적립 개수와 응모 여부에 먼저 반영한 뒤 스탬프판을 재조회한다.
- `collectStamp(token)`은 경우마다 화면 안내가 달라서 에러 대신 결과로 돌려준다(위 적립 에러 표). `code`를 결과로 바꾸는 일은 `stamp.api.ts`에서 한다. 만료·유효하지 않은 토큰은 같은 스캔 동안 다시 보내지 않는다.
- 구역 수료는 적립 직후 캐시에서 현재 서버 설정과 같은 기준(5개)으로 갱신하고, 재조회 응답의 `completed`로 동기화한다. "수료까지 N개"도 같은 기준으로 계산한다. Figma 시안은 기준 3개로 보여 디자인 확인이 필요하다.
- 럭키드로우 안내: 응모 여부는 `luckyDrawEntered`, 안내를 봤는지는 기기 기록(`use-lucky-draw-notice`)으로 판단한다. 적립 응답의 `luckyDrawJustEntered`를 쓰면 기기 기록 없이 한 번만 띄울 수 있다(TODO).
- 화면 문구: 디자인에는 "이미 수집한 스탬프입니다."만 있다. 만료는 부스 운영자에게 새 QR 발급을 요청하도록 안내하고, 연속 적립 제한·본인 팀 부스는 임시 문구다(TODO).
- 참가자가 아닌 계정(TEAM·ADMIN)은 스탬프판 조회도 403이다. 이 경우 화면 처리는 정해지지 않았다.
