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

## 프론트 함수

| 프론트 함수           | 용도                                       | 쿼리 키                                             |
| --------------------- | ------------------------------------------ | --------------------------------------------------- |
| `getStampBoard()`     | 스탬프판(구역별 부스·적립 여부·럭키드로우) | `["stamps", "board"]`                               |
| `collectStamp(token)` | QR 토큰으로 적립                           | — (적립·이미 받음이면 `["stamps", "board"]` 무효화) |

## 공통 응답 (서버 `common/dto`)

| 형태              | 필드                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `SuccessResponse` | `data`, `message` (null이면 키 생략)                                          |
| `ErrorResponse`   | `status`, `code`(`ErrorCode` 이름), `message`, `errors?: { field, reason }[]` |

## 구현 메모

- 적립(STAMP-03)은 부스 운영자 QR의 토큰으로 한다. QR 내용은 `<사이트 주소>/stamp/collect?token=<토큰>`이라 앱 스캐너와 휴대폰 기본 카메라가 같은 처리를 거친다.
- `collectStamp(token)`은 경우마다 화면 안내가 달라서 에러 대신 결과로 돌려준다(위 적립 에러 표). `code`를 결과로 바꾸는 일은 `stamp.api.ts`에서 한다. 만료·유효하지 않은 토큰은 같은 스캔 동안 다시 보내지 않는다.
- 구역 수료 여부는 서버 `completed`를 따른다. "수료까지 N개"는 응답에 기준값이 없어 프론트 상수(5, 서버 설정과 같음)로 계산한다. Figma 시안은 기준 3개로 보여 디자인 확인이 필요하다.
- 럭키드로우 안내: 응모 여부는 `luckyDrawEntered`, 안내를 봤는지는 기기 기록(`use-lucky-draw-notice`)으로 판단한다. 적립 응답의 `luckyDrawJustEntered`를 쓰면 기기 기록 없이 한 번만 띄울 수 있다(TODO).
- 화면 문구: 디자인에는 "이미 수집한 스탬프입니다."만 있다. 만료는 인식 실패 문구를 함께 쓰고, 연속 적립 제한·본인 팀 부스는 임시 문구다(TODO).
- 참가자가 아닌 계정(TEAM·ADMIN)은 스탬프판 조회도 403이다. 이 경우 화면 처리는 정해지지 않았다.
