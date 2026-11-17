import { mockNow, mockResponse } from "@/shared/api/mock";

import type { Stamp, StampZone } from "../types";
import { MOCK_USER_ID, mockStampZones, mockStamps, readMockStampToken } from "./stamp.mock";

// TODO: 서버 API가 나오면 api.get/post("...")로 교체한다.
export function getMyStamps(): Promise<Stamp[]> {
  return mockResponse(mockStamps.filter((stamp) => stamp.userId === MOCK_USER_ID));
}

/** 스탬프판 구역과 구역별 부스 목록 */
export function getStampZones(): Promise<StampZone[]> {
  return mockResponse(mockStampZones);
}

/** QR 토큰으로 스탬프를 받은 결과. 이미 받은 부스·잘못된 토큰은 화면이 다르게 안내해서 에러 대신 결과로 돌려준다 */
export type CollectStampResult =
  | { status: "collected"; boothId: number }
  | { status: "already-collected"; boothId: number }
  | { status: "invalid-token" };

/** 같은 부스 스탬프는 한 번만 받을 수 있다. (서버 unique 제약) */
export function collectStamp(token: string): Promise<CollectStampResult> {
  const boothId = readMockStampToken(token);
  const isBoardBooth = mockStampZones.some((zone) => zone.booths.some((booth) => booth.boothId === boothId));
  if (boothId === null || !isBoardBooth) return mockResponse({ status: "invalid-token" });

  const exists = mockStamps.some((stamp) => stamp.userId === MOCK_USER_ID && stamp.boothId === boothId);
  if (exists) return mockResponse({ status: "already-collected", boothId });

  const now = mockNow();
  mockStamps.push({ id: mockStamps.length + 1, createdAt: now, updatedAt: now, userId: MOCK_USER_ID, boothId });
  return mockResponse({ status: "collected", boothId });
}
