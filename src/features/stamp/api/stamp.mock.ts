import type { Stamp } from "../types";

// TODO: 서버 API가 나오면 실제 응답으로 교체한다.
// 서버가 토큰으로 사용자를 구분하는 부분을 목에서는 이 값으로 대신한다.
export const MOCK_USER_ID = 1;

export const mockStamps: Stamp[] = [
  {
    id: 1,
    createdAt: "2026-11-21T13:10:00",
    updatedAt: "2026-11-21T13:10:00",
    userId: MOCK_USER_ID,
    boothId: 1,
  },
  {
    id: 2,
    createdAt: "2026-11-21T13:40:00",
    updatedAt: "2026-11-21T13:40:00",
    userId: MOCK_USER_ID,
    boothId: 3,
  },
];
