import { mockNow, mockResponse } from "@/shared/api/mock";

import type { OperatorBooth, Stamp, StampToken, StampZone } from "../types";
import {
  createMockStampToken,
  MOCK_STAMP_TOKEN_TTL_MS,
  MOCK_USER_ID,
  mockOperatorBooth,
  mockStampZones,
  mockStamps,
  readMockStampToken,
} from "./stamp.mock";

// TODO: 서버 API가 나오면 api.get/post("...")로 교체한다.
export function getMyStamps(): Promise<Stamp[]> {
  return mockResponse(mockStamps.filter((stamp) => stamp.userId === MOCK_USER_ID));
}

/** 스탬프판 구역과 구역별 부스 목록 */
export function getStampZones(): Promise<StampZone[]> {
  return mockResponse(mockStampZones);
}

/**
 * QR 토큰으로 스탬프를 받은 결과. 화면이 경우마다 다르게 안내해서 에러 대신 결과로 돌려준다.
 * 서버(PR #15) 응답과의 대응: 200 → collected, 409 → already-collected,
 * 400 QR_TOKEN_EXPIRED → expired, 400 QR_TOKEN_NOT_FOUND → invalid-token, 429 → cooldown
 */
export type CollectStampResult =
  | { status: "collected"; boothId: number }
  | { status: "already-collected"; boothId: number }
  | { status: "expired" }
  | { status: "invalid-token" }
  | { status: "cooldown" };

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

/** QR 발급 화면에 보여줄 운영자의 부스 */
export function getOperatorBooth(): Promise<OperatorBooth> {
  return mockResponse(mockOperatorBooth);
}

/** 운영자 부스의 스탬프 QR 토큰을 새로 발급한다. 토큰은 1분 뒤 만료된다 (STAMP-01-2) */
export function issueStampToken(): Promise<StampToken> {
  const expiresAt = new Date(Date.now() + MOCK_STAMP_TOKEN_TTL_MS);
  return mockResponse({
    token: createMockStampToken(mockOperatorBooth.boothId),
    // 서버 LocalDateTime처럼 타임존 없는 로컬 시각 문자열
    expiresAt: toLocalDateTime(expiresAt),
  });
}

function toLocalDateTime(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
}
