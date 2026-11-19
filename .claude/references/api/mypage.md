# mypage API

로그인한 사용자의 기본 정보와 소속 팀원 목록을 조회한다. 명세는 2026-11-19 dev Swagger에서 확인했다.

## Endpoints

| Method | Path                  | Operation   | 비고                     |
| ------ | --------------------- | ----------- | ------------------------ |
| GET    | `/api/v1/user/mypage` | `getMyPage` | Bearer access token 필요 |

요청 파라미터와 본문은 없다. 서버는 access token으로 조회할 사용자를 식별한다.

## 성공 응답

공통 응답 형식은 `{ data: MyPageResponse, message?: string }`이다. 프런트는 `shared/api/types.ts`의 `ApiResponse<T>`를 사용한다.

### `MyPageResponse`

| Field            | Type           | 비고                   |
| ---------------- | -------------- | ---------------------- |
| `userId`         | number         | 사용자 식별자          |
| `name`           | string         | 사용자 이름            |
| `loginId`        | string         | 로그인 ID              |
| `teamNumber`     | number \| null | 팀 미배정 시 번호 없음 |
| `teamMemberList` | `TeamMember[]` | 팀 미배정 시 빈 배열   |

### `TeamMember`

| Field  | Type   | 비고      |
| ------ | ------ | --------- |
| `name` | string | 팀원 이름 |
| `part` | `Part` | 팀원 파트 |

`Part`는 `PLAN`, `DESIGN`, `WEB`, `APP`, `SERVER` 중 하나다. 프로젝트 상세 응답과 같은 enum이다.

## 구현 메모

- 인증되지 않았거나 인증이 만료된 경우, 다른 기기 로그인으로 세션이 종료된 경우에는 `401` 응답이 올 수 있다. dev Swagger의 오류 코드는 `UNAUTHORIZED`, `TOKEN_EXPIRED`, `LOGGED_IN_ELSEWHERE`다.
- 사용자를 찾을 수 없거나 조회하는 계정이 `TEAM`이면 `404 USER_NOT_FOUND`를 반환한다.
