# 참가자 파트 타입의 공유 위치

- 상태: accepted
- 기록일: 2026-11-19

## 결정

참가자 파트 `Part`는 `project`와 `mypage`가 같은 서버 응답 enum을 사용하므로 `src/shared/api/types.ts`에서 공유하고, 화면별 파트 표시 순서는 각 feature에 둔다.
